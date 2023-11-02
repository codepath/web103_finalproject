// CommentController.js
const { pool } = require('../config/database.js');

const getAllComments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "COMMENT"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createComment = async (req, res) => {
  const { content, postId } = req.body;
  try {
    const result = await pool.query('INSERT INTO "COMMENT" (content, postId) VALUES ($1, $2) RETURNING *', [content, postId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add updateComment and deleteComment functions if needed

module.exports = {
  getAllComments,
  createComment,
  // updateComment,
  // deleteComment
};
