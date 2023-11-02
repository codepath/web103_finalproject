import { pool } from '../config/database.js';

export const getAllResources = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "RESOURCE"');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createResource = async (req, res) => {
    const { link, typeId, userId } = req.body;

    try {
        const result = await pool.query('INSERT INTO "RESOURCE" (link, typeId, userId) VALUES ($1, $2, $3) RETURNING *', [link, typeId, userId]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Implement these functions if needed
// export const updateResource = async (req, res) => { ... };
// export const deleteResource = async (req, res) => { ... };
