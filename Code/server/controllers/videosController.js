import { pool } from "../config/database.js";

// GET /api/videos/match/:matchId — highlight/footage links for a match
export async function getVideosByMatch(req, res) {
    try {
        const matchId = req.params.matchId;
        const result = await pool.query(
            "SELECT * FROM video_links WHERE api_match_id = $1 ORDER BY created_at DESC",
            [matchId],
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// POST /api/videos — attach a video link to a match
export async function createVideo(req, res) {
    try {
        const { user_id, api_match_id, title, video_url, provider } = req.body;
        const result = await pool.query(
            `INSERT INTO video_links (user_id, api_match_id, title, video_url, provider)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, api_match_id, title, video_url, provider],
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}
