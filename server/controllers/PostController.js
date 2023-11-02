import { pool } from '../config/database.js';

export const getAllPosts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "POST"');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req, res) => {
    const { content, userId } = req.body;

    try {
        const result = await pool.query('INSERT INTO "POST" (content, userId) VALUES ($1, $2) RETURNING *', [content, userId]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Implement these functions if needed
// export const updatePost = async (req, res) => { ... };
// export const deletePost = async (req, res) => { ... };
