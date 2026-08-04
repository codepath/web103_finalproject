import { pool } from '../db/dbpool.js'

const getUser = async (req, res) => {
  const { id } = req.params
  const result = await pool.query(`
    SELECT * FROM users
    WHERE id=$1`, [id])
  return result.rows[0]
}

const updateDietaryPreferences = async (req, res) => {
  const { id, dietary_preferences } = req.body
  const result = await pool.query(`
    UPDATE users
    SET dietary_preferences = $1
    WHERE id=$2 RETURNING *`, [dietary_preferences, id])
  return result.rows[0]
}

export default {
  getUser,
  updateDietaryPreferences,
}



