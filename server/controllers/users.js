import { pool } from '../config/database.js';

const createUser = async (req, res) => {
    try {
        const { github_id, username, avatar_url, access_token } = req.body;
        const result = await pool.query(
            `INSERT INTO users (github_id, username, avatar_url, access_token)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [github_id, username, avatar_url, access_token]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { github_id, username, avatar_url, access_token } = req.body;
        const id = parseInt(req.params.id);
        const result = await pool.query(
            `UPDATE users
            SET github_id = $1, username = $2, avatar_url = $3, access_token = $4
            WHERE id = $5
            RETURNING *`,
            [github_id, username, avatar_url, access_token, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).json();
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
