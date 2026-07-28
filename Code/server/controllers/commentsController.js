import { pool } from "../config/database.js";

// GET /api/comments/match/:matchId — all comments on a match
export async function getCommentsByMatch(req, res) {
    try {
        const matchId = req.params.matchId;
        const result = await pool.query(
            `SELECT c.*, u.email FROM comments c
             JOIN users u ON c.user_id = u.user_id
             WHERE c.api_match_id = $1 ORDER BY c.created_at DESC`,
            [matchId],
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// POST /api/comments — leave a comment on a match
export async function createComment(req, res) {
    try {
        const { user_id, api_match_id, content } = req.body;
        const result = await pool.query(
            `INSERT INTO comments (user_id, api_match_id, content)
             VALUES ($1, $2, $3) RETURNING *`,
            [user_id, api_match_id, content],
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// DELETE /api/comments/:id — delete your comment
export async function deleteComment(req, res) {
    try {
        const id = parseInt(req.params.id);
        await pool.query("DELETE FROM comments WHERE comment_id = $1", [id]);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}
