import { pool } from '../db/dbpool.js'
import ingredientsModel from './ingredientsModel.js'

const getKitchen = async (req, res) => {
  const userId = req.user.id
  const result = await pool.query(`
    SELECT kitchen.id, kitchen.quantity, kitchen.unit,
           ingredients.id AS ingredient_id, ingredients.name,
           ingredients.category, ingredients.calories, ingredients.dietary_tags
    FROM kitchen
    JOIN ingredients ON ingredients.id = kitchen.ingredient_id
    WHERE kitchen.user_id=$1`, [userId])
  return result.rows
}

const updateQuantity = async (userId, ingredientId, quantity, unit) => {
  const result = await pool.query(`
    UPDATE kitchen SET quantity=$1, unit=$2
    WHERE user_id=$3 AND ingredient_id=$4
    RETURNING *`, [quantity || null, unit || null, userId, ingredientId])
  return result.rows[0]
}

const addToKitchen = async (req, res) => {
  const userId = req.user.id
  const { name, category, calories, dietary_tags, quantity, unit } = req.body

  const existing = await pool.query(`
    SELECT * FROM ingredients WHERE name=$1`, [name])
  const ingredient = existing.rows[0]
    || await ingredientsModel.createIngredient({ name, category, calories, dietary_tags })

  const alreadyInKitchen = await pool.query(`
    SELECT * FROM kitchen
    WHERE user_id=$1 AND ingredient_id=$2`, [userId, ingredient.id])

  if (alreadyInKitchen.rows[0]) {
    const updated = await updateQuantity(userId, ingredient.id, quantity, unit)
    return { ...ingredient, ...updated }
  }

  const kitchenResult = await pool.query(`
    INSERT INTO kitchen (user_id, ingredient_id, quantity, unit)
    VALUES ($1, $2, $3, $4)
    RETURNING *`, [userId, ingredient.id, quantity || null, unit || null])

  return { ...ingredient, ...kitchenResult.rows[0] }
}

const removeFromKitchen = async (req, res) => {
  const { ingredientId } = req.params
  const userId = req.user.id
  const result = await pool.query(`
    DELETE FROM kitchen
    WHERE user_id=$1 AND ingredient_id=$2
    RETURNING *`, [userId, ingredientId])
  return result.rows[0]
}

export default {
  getKitchen,
  addToKitchen,
  removeFromKitchen,
}
