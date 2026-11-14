import { pool as defaultPool } from '../config/database.js'
import { isLoggedIn } from '../utils/access.js'
import { sendDatabaseError, sendNotFound, sendValidationError } from '../utils/http.js'
import { isValidId } from '../utils/validators.js'

const MAX_COMMENT_LENGTH = 1000

const createCommentsController = ({ pool = defaultPool } = {}) => {
    const visitorId = (req) => (isLoggedIn(req) ? req.user.user_id : null)

    const getComments = async (req, res) => {
        try {
            const { eventId } = req.params
            if (!isValidId(eventId)) return sendNotFound(res, 'Event')

            const userId = visitorId(req)

            const results = await pool.query(
                `SELECT c.comment_id, c.comment_text, c.created_at,
                        u.user_id, u.full_name, u.user_image_url,
                        COUNT(l.like_id)::int AS like_count,
                        BOOL_OR(l.user_id = $1) AS liked_by_me
                 FROM event_comments c
                 JOIN users u ON u.user_id = c.user_id
                 LEFT JOIN comment_likes l ON l.comment_id = c.comment_id
                 WHERE c.event_id = $2
                 GROUP BY c.comment_id, u.user_id, u.full_name, u.user_image_url
                 ORDER BY c.created_at DESC`,
                [userId, eventId]
            )

            res.status(200).json(results.rows)
        } catch (error) {
            sendDatabaseError(res, 'fetch comments', error)
        }
    }

    const createComment = async (req, res) => {
        try {
            const { eventId } = req.params
            if (!isValidId(eventId)) return sendNotFound(res, 'Event')

            const text = typeof req.body?.comment_text === 'string' ? req.body.comment_text.trim() : ''
            if (!text) return sendValidationError(res, { comment_text: 'Comment cannot be empty.' })
            if (text.length > MAX_COMMENT_LENGTH) {
                return sendValidationError(res, { comment_text: `Comment must be at most ${MAX_COMMENT_LENGTH} characters.` })
            }

            const event = await pool.query('SELECT event_id FROM events WHERE event_id = $1', [eventId])
            if (event.rows.length === 0) return sendNotFound(res, 'Event')

            const created = await pool.query(
                `INSERT INTO event_comments (event_id, user_id, comment_text)
                 VALUES ($1, $2, $3)
                 RETURNING comment_id, comment_text, created_at`,
                [eventId, req.user.user_id, text]
            )

            const user = await pool.query(
                'SELECT user_id, full_name, user_image_url FROM users WHERE user_id = $1',
                [req.user.user_id]
            )

            res.status(201).json({ ...created.rows[0], ...user.rows[0], like_count: 0, liked_by_me: false })
        } catch (error) {
            sendDatabaseError(res, 'post the comment', error)
        }
    }

    const likeComment = async (req, res) => {
        try {
            const { eventId, commentId } = req.params
            if (!isValidId(eventId) || !isValidId(commentId)) return sendNotFound(res, 'Comment')

            const comment = await pool.query(
                'SELECT comment_id FROM event_comments WHERE comment_id = $1 AND event_id = $2',
                [commentId, eventId]
            )
            if (comment.rows.length === 0) return sendNotFound(res, 'Comment')

            await pool.query(
                'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [commentId, req.user.user_id]
            )

            res.status(204).send()
        } catch (error) {
            sendDatabaseError(res, 'like the comment', error)
        }
    }

    const unlikeComment = async (req, res) => {
        try {
            const { eventId, commentId } = req.params
            if (!isValidId(eventId) || !isValidId(commentId)) return sendNotFound(res, 'Comment')

            await pool.query(
                'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
                [commentId, req.user.user_id]
            )

            res.status(204).send()
        } catch (error) {
            sendDatabaseError(res, 'unlike the comment', error)
        }
    }

    return { getComments, createComment, likeComment, unlikeComment }
}

export { createCommentsController }
export default createCommentsController()
