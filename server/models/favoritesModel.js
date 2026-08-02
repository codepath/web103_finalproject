import { pool } from '../db/dbpool.js'

const getFavorites = async (req, res) => {
  const userId = req.user.id
  // console.log("USER ID:", userId)
  const result = await pool.query(`
    SELECT * FROM favorites
    WHERE user_id=$1`, [userId])
  // console.log("ROWS:", result.rows)
  return result.rows
}

const getFavorite = async (req, res) => {
  const { id } = req.params
  const result = await pool.query(`
    SELECT * FROM favorites
    WHERE id=$1`, [id])
  return result.rows[0]
}

const createFavorite = async (req, res) => {
  const { recipe_id } = req.body
  const userId = req.user.id
  const result = await pool.query(`
    INSERT INTO favorites (user_id, recipe_id)
    VALUES ($1, $2)
    RETURNING *`, [userId, recipe_id])
  // console.log(`model creating favorite ${result.rows[0]}`)
  return result.rows[0]
}

const deleteFavorite = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  console.log(`recipeID: ${id}`)
  console.log(`userID: ${userId}`)
  const result = await pool.query(`
    DELETE FROM favorites 
    WHERE user_id=$1 AND recipe_id=$2
    RETURNING *`, [userId,id])
  console.log(`RESULT: ${result}`)
  return result.rows[0]
}

export default {
  getFavorites,
  getFavorite,
  createFavorite,
  deleteFavorite,
}



