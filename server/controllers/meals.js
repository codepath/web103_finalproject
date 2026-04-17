import { pool } from '../config/database.js'

const createMeal = async (req, res) => {
  try {
    const { user_id, name, date, notes } = req.body

    const results = await pool.query(
      'INSERT INTO meals (user_id, name, date, notes) \
      VALUES ($1, $2, $3, $4) \
      RETURNING *',
      [user_id, name, date, notes]
    )

    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getMeals = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM meals ORDER BY date DESC')

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getMeal = async (req, res) => {
  try {
    const { id } = req.params

    const results = await pool.query('SELECT * FROM meals WHERE id = $1', [id])

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getMealsByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const results = await pool.query(
      'SELECT * FROM meals WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    )

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const updateMeal = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id, name, date, notes } = req.body

    const results = await pool.query(
      'UPDATE meals SET user_id = $1, name = $2, date = $3, notes = $4 \
      WHERE id = $5 \
      RETURNING *',
      [user_id, name, date, notes, id]
    )

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params

    await pool.query('DELETE FROM meals WHERE id = $1', [id])

    res.status(200).json({ message: `Meal ${id} deleted successfully` })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

export default {
  createMeal,
  getMeals,
  getMeal,
  getMealsByUser,
  updateMeal,
  deleteMeal
}
