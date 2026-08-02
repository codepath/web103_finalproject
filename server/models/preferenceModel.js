import { pool } from '../db/dbpool.js'

const createPreference = async (req, res) => {
  const userId = req.user.id
  const { preference } = req.body
  const result = await pool.query(`
    INSERT INTO dietary_preferences
    (user_id, preference)
    VALUES ($1, $2)
    RETURNING *`, [userId, preference])
  return result.rows[0]
}

const getPreference = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  console.log("USER:", req.user)
  console.log("BODY:", req.body)
  const result = await pool.query(`
    SELECT * FROM dietary_preferences
    WHERE id=$1
  `, [id])
  return result.rows[0]
}

const getPreferences = async (req, res) => {
  // const { user_id } = req.body
  const userId = req.user.id
  const result = await pool.query(`
    SELECT * FROM dietary_preferences
    WHERE user_id=$1`, [userId])
  return result.rows
}

const deletePreference = async (req, res) => {
  const { id } = req.params
  const result = await pool.query(`
    DELETE FROM dietary_preferences
    WHERE id=$1 RETURNING *`, [id])
  return result.rows[0]
}

export default {
  createPreference,
  getPreference,
  getPreferences,
  deletePreference,
}
