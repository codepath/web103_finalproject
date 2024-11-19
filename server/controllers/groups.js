import { pool } from '../config/database.js';

const createGroup = async (req, res) => {
    try {
        const { name, description, created_by } = req.body;
        const result = await pool.query(
            `INSERT INTO groups (name, description, created_by)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, description, created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getGroups = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM groups ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

//add authentication to update group so only users can update
const updateGroup = async (req, res) => {
    try {
        const { name, description, created_by } = req.body;
        const id = parseInt(req.params.id);
        const result = await pool.query(
            `UPDATE groups
            SET name = $1, description = $2, created_by = $3
            WHERE id = $4
            RETURNING *`,
            [name, description, created_by, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

// add authentication also
const deleteGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await pool.query('DELETE FROM groups WHERE id = $1', [id]);
        res.status(204).json();
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export default {
    createGroup,
    getGroups,
    getGroup,
    updateGroup,
    deleteGroup
};
