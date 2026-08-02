import { pool } from '../db/dbpool.js'

const getScheduledMeals = async (req, res) => {
  const userId = req.user.id
  const result = await pool.query(`
    SELECT scheduled_meals.*, recipes.title, recipes.image_url
    FROM scheduled_meals
    JOIN recipes ON recipes.id = scheduled_meals.recipe_id
    WHERE scheduled_meals.user_id=$1
    ORDER BY scheduled_meals.date ASC`, [userId])
  return result.rows
}

const createScheduledMeal = async (req, res) => {
  const userId = req.user.id
  const { recipe_id, date, meal_type } = req.body
  const result = await pool.query(`
    INSERT INTO scheduled_meals (user_id, recipe_id, date, meal_type)
    VALUES ($1, $2, $3, $4)
    RETURNING *`, [userId, recipe_id, date, meal_type])
  return result.rows[0]
}

const deleteScheduledMeal = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const result = await pool.query(`
    DELETE FROM scheduled_meals
    WHERE id=$1 AND user_id=$2
    RETURNING *`, [id, userId])
  return result.rows[0]
}

export default {
  getScheduledMeals,
  createScheduledMeal,
  deleteScheduledMeal,
}
