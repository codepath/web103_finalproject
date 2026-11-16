import express from 'express'
import { pool } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET /api/profile  the logged-in user, their profile (one-to-one), and the events they created
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.username, u.avatar_url, u.created_at,
              p.bio, p.city, p.website_url
       FROM users u LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id],
    )
    if (!rows.length) return res.status(404).json({ error: 'User not found' })

    const { rows: events } = await pool.query(
      `SELECT id, title, start_time FROM events WHERE created_by = $1 ORDER BY start_time`,
      [req.user.id],
    )
    res.json({ ...rows[0], events })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
