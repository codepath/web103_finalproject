import { pool } from '../config/database.js'

const createComment = async (req, res) => {
  try {
    const sneaker_id = parseInt(req.params.sneaker_id)
    const { comment } = req.body

    const results = await pool.query(
      `INSERT INTO comments (comment, sneaker_id)
      VALUES($1, $2) 
      RETURNING *`,
      [comment, sneaker_id]
    )
    res.status(201).json(results.rows[0])
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const getComments= async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM comments ORDER BY id ASC')
    res.status(200).json(results.rows)
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const getSneakerComments = async (req, res) => {
  try {
    const sneaker_id = parseInt(req.params.sneaker_id)
    const results = await pool.query('SELECT * FROM comments WHERE sneaker_id = $1', [sneaker_id])
    res.status(200).json(results.rows)
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const updateSneakerLikes = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { num_votes } = req.body
    const results = await pool.query(
      `UPDATE comments
      SET num_votes = $1
      WHERE id = $2`,
      [parseInt(num_votes), id]
    )
    res.status(200).json(results.rows[0])
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const deleteComment = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const results = await pool.query('DELETE FROM comments WHERE id = $1', [id])
    res.status(200).json(results.rows[0])
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

export default {
  getComments,
  getSneakerComments,
  createComment,
  deleteComment,
  updateSneakerLikes
}