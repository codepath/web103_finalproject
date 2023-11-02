// ResourceController.js
const { pool } = require('../config/database.js');

const getAllResources = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "RESOURCE"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createResource = async (req, res) => {
  const { link, typeId, userId } = req.body;
  try {
    const result = await pool.query('INSERT INTO "RESOURCE" (link, typeId, userId) VALUES ($1, $2, $3) RETURNING *', [link, typeId, userId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add updateResource and deleteResource functions if needed

module.exports = {
  getAllResources,
  createResource,
  // updateResource,
  // deleteResource
};
