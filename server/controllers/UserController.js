// UserController.js
const { pool } = require('../config/database.js');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "USER"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('INSERT INTO "USER" (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add updateUser and deleteUser functions if needed

module.exports = {
  getAllUsers,
  createUser,
  // updateUser,
  // deleteUser
};
