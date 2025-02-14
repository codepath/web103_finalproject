import { pool } from '../config/database.js';

const getGoals = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const results = await pool.query('SELECT * FROM savings_goals where user_id = $1', [user_id]);
        res.status(200).json({ message: 'Goals retrieved successfully', data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const addGoal = async (req, res) => {
    try {
        const { goal_name, target_amount, current_amount, user_id, deadline } = req.body;
        const results = await pool.query(
            'INSERT INTO savings_goals (goal_name, target_amount, current_amount, user_id, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [goal_name, target_amount, current_amount, user_id, deadline || 0]
        );
        res.status(201).json({ message: 'Goal added successfully', data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateGoal = async (req, res) => {
    try {
        const goalId = parseInt(req.params.goal_id);
        const { current_amount } = req.body;
        const results = await pool.query(
            'UPDATE savings_goals SET current_amount = $1 WHERE id = $2 RETURNING *',
            [current_amount, goalId]
        );
        res.status(200).json({ message: 'Goal updated successfully', data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const goalId = parseInt(req.params.goal_id);
        await pool.query('DELETE FROM savings_goals WHERE id = $1', [goalId]);
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    addGoal,
    getGoals,
    updateGoal,
    deleteGoal
};