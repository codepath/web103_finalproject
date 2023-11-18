import { pool } from '../config/database.js';

export const getAllTypes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "TYPE"');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createType = async (req, res) => {
    const { name } = req.body;

    try {
        const result = await pool.query('INSERT INTO "TYPE" (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Implement these functions if needed
// export const updateType = async (req, res) => { ... };
// export const deleteType = async (req, res) => { ... };
