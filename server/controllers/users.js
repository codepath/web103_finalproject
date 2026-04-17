import { pool } from '../config/database.js'

const createUser = async (req, res) => {
  try {
    const { goal, calorie_target, protein_target, carb_target, fat_target } = req.body

    const results = await pool.query(
      'INSERT INTO users (goal, calorie_target, protein_target, carb_target, fat_target) \
      VALUES ($1, $2, $3, $4, $5) \
      RETURNING *',
      [goal, calorie_target, protein_target, carb_target, fat_target]
    )

    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getUsers = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM users ORDER BY id ASC')

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getUser = async (req, res) => {
  try {
    const { id } = req.params

    const results = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { goal, calorie_target, protein_target, carb_target, fat_target } = req.body

    const results = await pool.query(
      'UPDATE users SET goal = $1, calorie_target = $2, protein_target = $3, carb_target = $4, fat_target = $5 \
      WHERE id = $6 \
      RETURNING *',
      [goal, calorie_target, protein_target, carb_target, fat_target, id]
    )

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    await pool.query('DELETE FROM users WHERE id = $1', [id])

    res.status(200).json({ message: `User ${id} deleted successfully` })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
}
