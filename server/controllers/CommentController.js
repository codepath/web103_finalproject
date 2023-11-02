import { pool } from '../config/database.js';

export const getAllComments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "COMMENT"');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createComment = async (req, res) => {
    const { content, postId } = req.body;

    try {
        const result = await pool.query('INSERT INTO "COMMENT" (content, postId) VALUES ($1, $2) RETURNING *', [content, postId]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Implement these functions if needed
// export const updateComment = async (req, res) => { ... };
// export const deleteComment = async (req, res) => { ... };
