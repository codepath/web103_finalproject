import { pool } from '../config/database.js'

const createFoodItem = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, serving_unit } = req.body

    const results = await pool.query(
      'INSERT INTO food_items (name, calories, protein, carbs, fat, serving_unit) \
      VALUES ($1, $2, $3, $4, $5, $6) \
      RETURNING *',
      [name, calories, protein, carbs, fat, serving_unit]
    )

    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getFoodItems = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM food_items ORDER BY name ASC')

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getFoodItem = async (req, res) => {
  try {
    const { id } = req.params

    const results = await pool.query('SELECT * FROM food_items WHERE id = $1', [id])

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params
    const { name, calories, protein, carbs, fat, serving_unit } = req.body

    const results = await pool.query(
      'UPDATE food_items SET name = $1, calories = $2, protein = $3, carbs = $4, fat = $5, serving_unit = $6 \
      WHERE id = $7 \
      RETURNING *',
      [name, calories, protein, carbs, fat, serving_unit, id]
    )

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params

    await pool.query('DELETE FROM food_items WHERE id = $1', [id])

    res.status(200).json({ message: `Food item ${id} deleted successfully` })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

export default {
  createFoodItem,
  getFoodItems,
  getFoodItem,
  updateFoodItem,
  deleteFoodItem
}
