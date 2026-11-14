import { pool as defaultPool } from '../config/database.js'
import { isLoggedIn } from '../utils/access.js'
import { EVENTS_WITH_DETAILS, ONE_ROW_PER_EVENT } from '../utils/eventSql.js'
import { sendDatabaseError, sendNotFound, sendValidationError } from '../utils/http.js'
import { createRulesLoader } from '../utils/schemaRules.js'
import { SETTING, requireSetting } from '../utils/settings.js'
import { addTimezone } from '../utils/timezone.js'
import { PROFILE_FIELDS, isValidId, validateProfileInput } from '../utils/validators.js'

// the details anyone can see about a person (never the password or the GitHub columns)
const PUBLIC_COLUMNS = 'users.user_id, users.full_name, users.city, users.state, users.user_image_url, users.user_type'

// the extra details only the person themself can see
const SELF_COLUMNS = `${PUBLIC_COLUMNS}, users.email, users.country, users.zipcode`

// the ways to ask for a person's events: the ones in groups they organize, or the ones they said they are going to
const EVENT_ROLES = {
    created: 'groups.organizer_id = $3',
    attending: 'EXISTS (SELECT 1 FROM rsvps AS going WHERE going.event_id = events.event_id AND going.user_id = $3 AND going.rsvp_status = $1)'
}

// the database and rules can be swapped out, so tests never need a real one
const createUsersController = ({ pool = defaultPool, loadRules = createRulesLoader(pool) } = {}) => {
    const getUsers = async (req, res) => {
        try {
            const results = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY users.user_id ASC`)
            res.status(200).json(results.rows)
        } catch (error) {
            sendDatabaseError(res, 'fetch users', error)
        }
    }

    // the logged-in person's own profile, including whether they are a host (so pages know which buttons to show)
    const getMe = async (req, res) => {
        try {
            const results = await pool.query(`SELECT ${SELF_COLUMNS} FROM users WHERE users.user_id = $1`, [req.user.user_id])
            if (results.rows.length === 0) return sendNotFound(res, 'User')

            const me = results.rows[0]
            res.status(200).json({ ...me, is_host: me.user_type === requireSetting(SETTING.hostUserType) })
        } catch (error) {
            sendDatabaseError(res, 'fetch your profile', error)
        }
    }

    const getUserById = async (req, res) => {
        try {
            const userId = req.params.userId
            if (!isValidId(userId)) return sendNotFound(res, 'User')

            // a person sees their own email, country and ZIP code; everyone else does not
            const isSelf = isLoggedIn(req) && String(req.user.user_id) === String(userId)
            const results = await pool.query(`SELECT ${isSelf ? SELF_COLUMNS : PUBLIC_COLUMNS} FROM users WHERE users.user_id = $1`, [userId])
            if (results.rows.length === 0) return sendNotFound(res, 'User')

            res.status(200).json(results.rows[0])
        } catch (error) {
            sendDatabaseError(res, 'fetch the user', error)
        }
    }

    // the events a person organizes and/or is going to, each tagged with how they are connected to it
    const getUserEvents = async (req, res) => {
        try {
            const userId = req.params.userId
            if (!isValidId(userId)) return sendNotFound(res, 'User')

            // with no role asked for, both kinds are returned
            const role = req.query.role
            if (role !== undefined && !Object.hasOwn(EVENT_ROLES, role)) {
                return sendValidationError(res, { role: `role must be one of: ${Object.keys(EVENT_ROLES).join(', ')}.` })
            }

            const person = await pool.query('SELECT 1 FROM users WHERE user_id = $1', [userId])
            if (person.rows.length === 0) return sendNotFound(res, 'User')

            // $1 is the "going" answer, $2 is the visitor and $3 is the person whose events these are
            const values = [requireSetting(SETTING.attendingStatus), isLoggedIn(req) ? req.user.user_id : null, userId]
            const roles = role === undefined ? Object.keys(EVENT_ROLES) : [role]

            const events = []
            for (const name of roles) {
                const results = await pool.query(`${EVENTS_WITH_DETAILS} WHERE ${EVENT_ROLES[name]}${ONE_ROW_PER_EVENT} ORDER BY events.start_time ASC`, values)
                events.push(...results.rows.map((row) => ({ ...addTimezone(row), role: name })))
            }

            res.status(200).json(events)
        } catch (error) {
            sendDatabaseError(res, 'fetch the events', error)
        }
    }

    // the groups a person belongs to (the ones they organize included), each tagged with their role;
    // when viewing their own profile, also includes groups they have saved but not joined
    const getUserGroups = async (req, res) => {
        try {
            const userId = req.params.userId
            if (!isValidId(userId)) return sendNotFound(res, 'User')

            const person = await pool.query('SELECT 1 FROM users WHERE user_id = $1', [userId])
            if (person.rows.length === 0) return sendNotFound(res, 'User')

            const isSelf = isLoggedIn(req) && String(req.user.user_id) === String(userId)

            const memberQuery = `
                SELECT groups.*,
                       organizers.full_name AS organizer_name,
                       COUNT(everyone.membership_id)::int AS member_count,
                       CASE WHEN groups.organizer_id = $1 THEN 'organizer' ELSE 'member' END AS role
                FROM members AS mine
                JOIN groups ON groups.group_id = mine.group_id
                JOIN users AS organizers ON organizers.user_id = groups.organizer_id
                LEFT JOIN members AS everyone ON everyone.group_id = groups.group_id
                WHERE mine.user_id = $1
                GROUP BY groups.group_id, organizers.user_id, mine.user_id`

            if (!isSelf) {
                const results = await pool.query(memberQuery + ' ORDER BY groups.group_name ASC', [userId])
                return res.status(200).json(results.rows)
            }

            // for self: member groups + saved groups not already joined
            const results = await pool.query(
                `(${memberQuery})
                 UNION ALL
                 (SELECT groups.*,
                         organizers.full_name AS organizer_name,
                         COUNT(everyone.membership_id)::int AS member_count,
                         'saved' AS role
                  FROM group_saves AS saves
                  JOIN groups ON groups.group_id = saves.group_id
                  JOIN users AS organizers ON organizers.user_id = groups.organizer_id
                  LEFT JOIN members AS everyone ON everyone.group_id = groups.group_id
                  WHERE saves.user_id = $1
                    AND NOT EXISTS (SELECT 1 FROM members WHERE members.user_id = $1 AND members.group_id = groups.group_id)
                  GROUP BY groups.group_id, organizers.user_id)
                 ORDER BY group_name ASC`,
                [userId]
            )

            res.status(200).json(results.rows)
        } catch (error) {
            sendDatabaseError(res, 'fetch the groups', error)
        }
    }

    // a logged-in person edits their own profile
    const updateMe = async (req, res) => {
        try {
            const rules = await loadRules()
            const body = req.body ?? {}

            const details = validateProfileInput(body, rules)
            if (Object.keys(details).length > 0) return sendValidationError(res, details)

            // trim the text; an emptied optional field is saved as nothing
            const changes = {}
            for (const field of PROFILE_FIELDS) {
                if (body[field] === undefined) continue
                const value = typeof body[field] === 'string' ? body[field].trim() : body[field]
                changes[field] = value === '' ? null : value
            }

            // a state is valid when the app has venues in it
            if (changes.state) {
                const covered = await pool.query('SELECT 1 FROM venues WHERE state = $1 LIMIT 1', [changes.state])
                if (covered.rows.length === 0) return sendValidationError(res, { state: 'Choose a state that has events on Orbit.' })
            }

            // the column names come from the fixed list of profile fields, never from what the person typed
            const assignments = Object.keys(changes).map((field, index) => `${field} = $${index + 1}`)
            const values = [...Object.values(changes), req.user.user_id]
            const updated = await pool.query(`UPDATE users SET ${assignments.join(', ')} WHERE user_id = $${values.length} RETURNING ${SELF_COLUMNS.replaceAll('users.', '')}`, values)

            res.status(200).json(updated.rows[0])
        } catch (error) {
            sendDatabaseError(res, 'update your profile', error)
        }
    }

    return { getUsers, getMe, getUserById, getUserEvents, getUserGroups, updateMe }
}

export { createUsersController }
export default createUsersController()
