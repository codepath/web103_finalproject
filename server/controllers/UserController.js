import { pool } from '../config/database.js';

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "GITHUBUSER"');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// export const createUser = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const result = await pool.query('INSERT INTO "USER" (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Implement these functions if needed
// export const updateUser = async (req, res) => { ... };
// export const deleteUser = async (req, res) => { ... };
