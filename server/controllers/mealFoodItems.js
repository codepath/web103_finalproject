import { pool } from '../config/database.js'

const addFoodItemToMeal = async (req, res) => {
  try {
    const { mealId } = req.params
    const { food_item_id, quantity } = req.body

    const results = await pool.query(
      'INSERT INTO meal_food_items (meal_id, food_item_id, quantity) \
      VALUES ($1, $2, $3) \
      RETURNING *',
      [mealId, food_item_id, quantity]
    )

    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getFoodItemsForMeal = async (req, res) => {
  try {
    const { mealId } = req.params

    const results = await pool.query(
      'SELECT mfi.id, mfi.quantity, mfi.meal_id, mfi.food_item_id, \
              fi.name, fi.calories, fi.protein, fi.carbs, fi.fat, fi.serving_unit \
       FROM meal_food_items mfi \
       JOIN food_items fi ON mfi.food_item_id = fi.id \
       WHERE mfi.meal_id = $1',
      [mealId]
    )

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const updateMealFoodItem = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    const results = await pool.query(
      'UPDATE meal_food_items SET quantity = $1 \
      WHERE id = $2 \
      RETURNING *',
      [quantity, id]
    )

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const removeFoodItemFromMeal = async (req, res) => {
  try {
    const { id } = req.params

    await pool.query('DELETE FROM meal_food_items WHERE id = $1', [id])

    res.status(200).json({ message: `Meal food item ${id} removed successfully` })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

export default {
  addFoodItemToMeal,
  getFoodItemsForMeal,
  updateMealFoodItem,
  removeFoodItemFromMeal
}
