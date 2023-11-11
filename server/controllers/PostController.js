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

export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "POST" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Implement these functions if needed
// export const updatePost = async (req, res) => { ... };
// export const deletePost = async (req, res) => { ... };
