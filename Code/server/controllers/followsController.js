import { pool } from '../config/database.js'

// GET /api/follows/user/:userId — teams a user follows
export async function getFollowsByUser(req, res) {
    try {
        const userId = parseInt(req.params.userId)
        const result = await pool.query(
            'SELECT * FROM followed_teams WHERE user_id = $1 ORDER BY followed_at DESC',
            [userId]
        )
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

// POST /api/follows — follow a team
export async function createFollow(req, res) {
    try {
        const { user_id, api_team_id, team_name } = req.body
        const result = await pool.query(
            `INSERT INTO followed_teams (user_id, api_team_id, team_name)
             VALUES ($1, $2, $3) RETURNING *`,
            [user_id, api_team_id, team_name]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

// DELETE /api/follows/:id — unfollow a team
export async function deleteFollow(req, res) {
    try {
        const id = parseInt(req.params.id)
        await pool.query('DELETE FROM followed_teams WHERE followed_team_id = $1', [id])
        res.status(200).json({ message: 'Team unfollowed successfully' })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}
