import { pool } from '../db/dbpool.js'

const createRecipe = async (req, res) => {
  const { id, title, description, instructions, image_url, avg_rating } = req.body 

  const result = await pool.query(
    `
      INSERT INTO recipes
      (title, description, instructions, image_url, avg_rating)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [title, description, instructions, image_url, avg_rating]
  )
  return result.rows[0]
}

const getRecipes = async (req, res) => {
  const query = `SELECT * FROM recipes`
  const data = await pool.query(query)
  return data.rows
}

const getRecipe = async (req, res) => {
  const { id } = req.params
  const query = `SELECT * FROM recipes WHERE id=$1`
  const data = await pool.query(query, [id])
  return data.rows[0]
}

const updateRecipe = async (req, res) => {
  const { id } = req.params
  const data = req.body
  const { title, description, instructions, image_url, avg_rating } = data 
  const result = await pool.query(`
    UPDATE recipes
    SET title=$1, description=$2, instructions=$3, image_url=$4, avg_rating=$5
    RETURNING *`,
    [title, description, instructions, image_url, avg_rating]
  );
  return result.rows[0]
}

const deleteRecipe = async (req, res) => {
  const { id } = req.params
  const result = await pool.query(`
    DELETE FROM recipes WHERE id=$1
    RETURNING *`, [id]
  );
  return result.rows[0]
}

export default {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe
}
