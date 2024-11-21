import { pool } from "../config/database.js";

const getExpenses = async (req, res) => {
    try {
        const user_id = req.params.id;
        // console.log(user_id);
        const results = await pool.query("SELECT * FROM expenses where user_id = $1", [user_id]);
        res.status(200).json({ message: "Expenses retrieved successfully", data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const getExpensesById = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         const results = await pool.query("SELECT * FROM expenses WHERE id = $1", [id]);
//         res.status(200).json({ message: "Expense retrieved successfully", data: results.rows });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const addExpenses = async (req, res) => {
    try {
        const { user_id, category_id, amount, description, date } = req.body;

        // console.log(user_id, category_id, amount, description, date);
        const results = await pool.query(
            "INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, category_id, amount, description, date]
        );
        res.status(201).json({ message: "Expense added successfully", data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateExpenses = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { user_id, category_id, amount, description, date } = req.body;
        const results = await pool.query(
            "UPDATE expenses SET user_id = $1, category_id = $2, amount = $3, description = $4, date = $5 WHERE id = $6 RETURNING *",
            [user_id, category_id, amount, description, date, id]
        );
        res.status(200).json({ message: "Expense updated successfully", data: results.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteExpenses = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await pool.query("DELETE FROM expenses WHERE id = $1", [id]);
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getExpenses,
    addExpenses,
    updateExpenses,
    deleteExpenses,
};
