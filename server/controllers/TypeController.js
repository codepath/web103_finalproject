// TypeController.js
const { pool } = require('../config/database.js');

const getAllTypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "TYPE"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createType = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO "TYPE" (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add updateType and deleteType functions if needed

module.exports = {
  getAllTypes,
  createType,
  // updateType,
  // deleteType
};
