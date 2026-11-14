import { pool as defaultPool } from '../config/database.js'
import { isLoggedIn } from '../utils/access.js'
import { sendDatabaseError, sendNotFound, sendServerError, sendValidationError } from '../utils/http.js'
import { createRulesLoader } from '../utils/schemaRules.js'
import { addSearchConditions } from '../utils/search.js'
import { GROUP_FIELDS, isValidId, validateGroupInput } from '../utils/validators.js'

// the query-string filters people can use, and the column each one checks
const FILTER_COLUMNS = {
    category: 'groups.category',
    city: 'users.city',
    state: 'users.state',
    zipcode: 'users.zipcode'
}

// the columns the search words are matched against
const SEARCH_COLUMNS = ['groups.group_name', 'groups.description']

// groups joined with the host who organizes them and how many people have joined
const GROUPS_WITH_DETAILS = `
    SELECT groups.*,
           users.full_name AS organizer_name,
           users.user_image_url AS organizer_image_url,
           users.city AS organizer_city,
           users.state AS organizer_state,
           COUNT(members.membership_id)::int AS member_count
    FROM groups
    JOIN users ON users.user_id = groups.organizer_id
    LEFT JOIN members ON members.group_id = groups.group_id`

// a typed category reuses the spelling of an existing one that differs only in capital letters ($n is the placeholder of the typed word)
const CATEGORY_SPELLING = 'COALESCE((SELECT kept.category FROM groups AS kept WHERE LOWER(kept.category) = LOWER($n) LIMIT 1), $n)'

// one row per group, even though each group can join many members
const ONE_ROW_PER_GROUP = ' GROUP BY groups.group_id, users.user_id'

// trim the text of the group fields that were sent; an empty description or picture becomes "nothing"
const cleanGroupFields = (body) => {
    const cleaned = {}

    for (const field of GROUP_FIELDS) {
        if (body[field] === undefined) continue

        const value = typeof body[field] === 'string' ? body[field].trim() : body[field]
        const isOptional = field === 'description' || field === 'group_image_url'
        cleaned[field] = isOptional && value === '' ? null : value
    }

    return cleaned
}

// the database and rules can be swapped out, so tests never need a real one
const createGroupsController = ({ pool = defaultPool, loadRules = createRulesLoader(pool) } = {}) => {
    const getGroups = async (req, res) => {
        try {
            const values = []
            const conditions = []

            // add a condition for every filter that was sent in the query string
            for (const [name, column] of Object.entries(FILTER_COLUMNS)) {
                if (req.query[name]) {
                    values.push(req.query[name])
                    // compare words without caring about capital letters, so "austin" finds "Austin"
                    conditions.push(`LOWER(${column}) = LOWER($${values.length})`)
                }
            }
            addSearchConditions(req.query.q, SEARCH_COLUMNS, values, conditions)

            // the same date filters as events: only groups that have an event in that time (one event must meet all of them)
            const eventConditions = []
            if (req.query.from) {
                values.push(req.query.from)
                eventConditions.push(`events.start_time >= $${values.length}`)
            }
            if (req.query.to) {
                values.push(req.query.to)
                eventConditions.push(`events.start_time < ($${values.length}::date + 1)`)
            }
            if (req.query.upcoming === 'true') eventConditions.push('events.start_time >= localtimestamp')
            if (eventConditions.length > 0) {
                conditions.push(`EXISTS (SELECT 1 FROM events WHERE events.group_id = groups.group_id AND ${eventConditions.join(' AND ')})`)
            }

            const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''
            const results = await pool.query(GROUPS_WITH_DETAILS + where + ONE_ROW_PER_GROUP + ' ORDER BY groups.group_name ASC', values)
            res.status(200).json(results.rows)
        } catch (error) {
            sendDatabaseError(res, 'fetch groups', error)
        }
    }

    const getGroupById = async (req, res) => {
        try {
            const groupId = req.params.groupId
            if (!isValidId(groupId)) return sendNotFound(res, 'Group')

            const results = await pool.query(GROUPS_WITH_DETAILS + ' WHERE groups.group_id = $1' + ONE_ROW_PER_GROUP, [groupId])
            if (results.rows.length === 0) return sendNotFound(res, 'Group')

            const group = results.rows[0]

            // tell a logged-in visitor whether they have already joined or saved the group
            if (isLoggedIn(req)) {
                const [membership, save] = await Promise.all([
                    pool.query('SELECT 1 FROM members WHERE group_id = $1 AND user_id = $2', [groupId, req.user.user_id]),
                    pool.query('SELECT 1 FROM group_saves WHERE group_id = $1 AND user_id = $2', [groupId, req.user.user_id])
                ])
                group.is_member = membership.rowCount > 0
                group.is_saved = save.rowCount > 0
            }

            res.status(200).json(group)
        } catch (error) {
            sendServerError(res, 'fetch the group', error)
        }
    }

    const createGroup = async (req, res) => {
        try {
            const rules = await loadRules()
            const body = req.body ?? {}

            const details = validateGroupInput(body, rules)
            if (Object.keys(details).length > 0) return sendValidationError(res, details)

            const fields = cleanGroupFields(body)

            // the group and its first member are saved together, so one never exists without the other
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                const created = await client.query(
                    `INSERT INTO groups (organizer_id, group_name, description, category, group_image_url)
                     VALUES ($1, $2, $3, ${CATEGORY_SPELLING.replaceAll('$n', '$4')}, $5)
                     RETURNING *`,
                    [req.user.user_id, fields.group_name, fields.description ?? null, fields.category, fields.group_image_url ?? null]
                )
                const group = created.rows[0]

                // the organizer is the first member of their own group
                await client.query('INSERT INTO members (user_id, group_id) VALUES ($1, $2)', [req.user.user_id, group.group_id])
                await client.query('COMMIT')
                res.status(201).json(group)
            } catch (error) {
                await client.query('ROLLBACK').catch(() => {})
                throw error
            } finally {
                client.release()
            }
        } catch (error) {
            sendServerError(res, 'create the group', error)
        }
    }

    const updateGroup = async (req, res) => {
        try {
            const groupId = req.params.groupId
            const rules = await loadRules()
            const body = req.body ?? {}

            const details = validateGroupInput(body, rules, { partial: true })
            if (Object.keys(details).length > 0) return sendValidationError(res, details)

            // change only the fields that were sent (the names come from the fixed list of group fields)
            const changes = cleanGroupFields(body)
            const assignments = Object.keys(changes).map((field, index) => (field === 'category' ? `category = ${CATEGORY_SPELLING.replaceAll('$n', `$${index + 1}`)}` : `${field} = $${index + 1}`))
            const values = [...Object.values(changes), groupId]

            const results = await pool.query(`UPDATE groups SET ${assignments.join(', ')} WHERE group_id = $${values.length} RETURNING *`, values)
            if (results.rows.length === 0) return sendNotFound(res, 'Group')

            res.status(200).json(results.rows[0])
        } catch (error) {
            sendServerError(res, 'update the group', error)
        }
    }

    const deleteGroup = async (req, res) => {
        try {
            const results = await pool.query('DELETE FROM groups WHERE group_id = $1', [req.params.groupId])
            if (results.rowCount === 0) return sendNotFound(res, 'Group')

            res.status(204).send()
        } catch (error) {
            sendServerError(res, 'delete the group', error)
        }
    }

    const joinGroup = async (req, res) => {
        try {
            const groupId = req.params.groupId
            if (!isValidId(groupId)) return sendNotFound(res, 'Group')

            const group = await pool.query('SELECT group_id FROM groups WHERE group_id = $1', [groupId])
            if (group.rows.length === 0) return sendNotFound(res, 'Group')

            // a second join does nothing, which the visitor is told about
            const joined = await pool.query(
                `INSERT INTO members (user_id, group_id) VALUES ($1, $2)
                 ON CONFLICT (user_id, group_id) DO NOTHING
                 RETURNING *`,
                [req.user.user_id, groupId]
            )
            if (joined.rows.length === 0) {
                return res.status(409).json({ error: 'You have already joined this group.' })
            }

            res.status(201).json(joined.rows[0])
        } catch (error) {
            sendServerError(res, 'join the group', error)
        }
    }

    const leaveGroup = async (req, res) => {
        try {
            const groupId = req.params.groupId
            if (!isValidId(groupId)) return sendNotFound(res, 'Group')

            const group = await pool.query('SELECT organizer_id FROM groups WHERE group_id = $1', [groupId])
            if (group.rows.length === 0) return sendNotFound(res, 'Group')

            // organizers cannot walk away from their own group (ids from Postgres can arrive as text)
            if (String(group.rows[0].organizer_id) === String(req.user.user_id)) {
                return res.status(403).json({ error: 'Organizers cannot leave their own group.' })
            }

            const left = await pool.query('DELETE FROM members WHERE group_id = $1 AND user_id = $2', [groupId, req.user.user_id])
            if (left.rowCount === 0) return res.status(404).json({ error: 'You are not a member of this group.' })

            res.status(204).send()
        } catch (error) {
            sendServerError(res, 'leave the group', error)
        }
    }

    const getGroupMembers = async (req, res) => {
        try {
            const groupId = req.params.groupId
            if (!isValidId(groupId)) return sendNotFound(res, 'Group')

            const group = await pool.query('SELECT group_id FROM groups WHERE group_id = $1', [groupId])
            if (group.rows.length === 0) return sendNotFound(res, 'Group')

            // members joined with the people behind them
            const results = await pool.query(
                `SELECT users.user_id, users.full_name, users.user_image_url, members.joined_at
                 FROM members
                 JOIN users ON users.user_id = members.user_id
                 WHERE members.group_id = $1
                 ORDER BY members.joined_at ASC`,
                [groupId]
            )
            res.status(200).json(results.rows)
        } catch (error) {
            sendServerError(res, 'fetch the members', error)
        }
    }

    // tells the access check who organizes the group in the request, or null if there is no such group
    const saveGroup = async (req, res) => {
        try {
            const { groupId } = req.params
            if (!isValidId(groupId)) return sendNotFound(res, 'Group')

            const group = await pool.query('SELECT group_id FROM groups WHERE group_id = $1', [groupId])
            if (group.rows.length === 0) return sendNotFound(res, 'Group')

            await pool.query(
                'INSERT INTO group_saves (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [groupId, req.user.user_id]
            )
            res.status(204).send()
        } catch (error) {
            sendDatabaseError(res, 'save the group', error)
        }
    }

    const unsaveGroup = async (req, res) => {
        try {
            const { groupId } = req.params
            if (!isValidId(groupId)) return sendNotFound(res, 'Group')

            await pool.query('DELETE FROM group_saves WHERE group_id = $1 AND user_id = $2', [groupId, req.user.user_id])
            res.status(204).send()
        } catch (error) {
            sendDatabaseError(res, 'unsave the group', error)
        }
    }

    const getGroupOrganizerId = async (req) => {
        if (!isValidId(req.params.groupId)) return null

        const results = await pool.query('SELECT organizer_id FROM groups WHERE group_id = $1', [req.params.groupId])
        return results.rows[0]?.organizer_id ?? null
    }

    return { getGroups, getGroupById, createGroup, updateGroup, deleteGroup, joinGroup, leaveGroup, getGroupMembers, saveGroup, unsaveGroup, getGroupOrganizerId }
}

export { createGroupsController }
export default createGroupsController()
