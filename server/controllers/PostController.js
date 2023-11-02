// PostController.js
const { pool } = require('../config/database.js');

const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "POST"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPost = async (req, res) => {
  const { content, userId } = req.body;
  try {
    const result = await pool.query('INSERT INTO "POST" (content, userId) VALUES ($1, $2) RETURNING *', [content, userId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add updatePost and deletePost functions if needed

module.exports = {
  getAllPosts,
  createPost,
  // updatePost,
  // deletePost
};
