import { pool } from '../config/database.js'

// GET /api/notifications/user/:userId — a user's notifications
export async function getNotificationsByUser(req, res) {
    try {
        const userId = parseInt(req.params.userId)
        const result = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        )
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

// PATCH /api/notifications/:id/read — mark a notification as read
export async function markNotificationRead(req, res) {
    try {
        const id = parseInt(req.params.id)
        const result = await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 RETURNING *',
            [id]
        )
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}
