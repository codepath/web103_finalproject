import { pool } from '../config/database.js'

// GET /api/predictions/user/:userId — all predictions a user has made
export async function getPredictionsByUser(req, res) {
    try {
        const userId = parseInt(req.params.userId)
        const result = await pool.query(
            'SELECT * FROM predictions WHERE user_id = $1 ORDER BY submitted_at DESC',
            [userId]
        )
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

// POST /api/predictions — place a prediction (points wager) on a match
export async function createPrediction(req, res) {
    try {
        const { user_id, api_match_id, predicted_home_score, predicted_away_score } = req.body
        const result = await pool.query(
            `INSERT INTO predictions (user_id, api_match_id, predicted_home_score, predicted_away_score)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, api_match_id, predicted_home_score, predicted_away_score]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}
