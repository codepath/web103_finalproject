import { pool } from '../config/database.js';

const getIncome = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const results = await pool.query('SELECT * FROM income where user_id = $1', [user_id]);
        res.status(200).json({ message: 'Income retrieved successfully', data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getIncomeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const results = await pool.query('SELECT * FROM income WHERE id = $1', [id]);
        res.status(200).json({ message: 'Income retrieved successfully', data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addIncome = async (req, res) => {
    try {
        const { user_id, amount, source, date } = req.body;
        const results = await pool.query(
            'INSERT INTO income (user_id, amount, source, date) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, amount, source, date]
        );
        res.status(201).json({ message: 'Income added successfully', data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateIncome = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { user_id, amount, source, date } = req.body;
        const results = await pool.query(
            'UPDATE income SET user_id = $1, amount = $2, source = $3, date = $4 WHERE id = $5 RETURNING *',
            [user_id, amount, source, date, id]
        );
        res.status(200).json({ message: 'Income updated successfully', data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await pool.query('DELETE FROM income WHERE id = $1', [id]);
        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getIncome,
    getIncomeById,
    addIncome,
    updateIncome,
    deleteIncome
};
