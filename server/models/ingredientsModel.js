import { pool } from '../db/dbpool.js'

const createIngredient = async (ingredient) => {
  const result = await pool.query(`
    INSERT INTO ingredients (name, category, calories, dietary_tags)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [ingredient.name, ingredient.category, ingredient.calories, ingredient.dietary_tags]
  );
  return result.rows[0];
}

const getIngredients = async () => {
  const result = await pool.query(`
    SELECT * FROM ingredients
`);
  return result.rows;
}

const getIngredient = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`
    SELECT * FROM ingredients WHERE id = $1`, [id]
  );
  return result.rows[0];
}

const updateIngredient = async (id, data) => {
  const { name, category, calories, dietary_tags } = data
  const result = await pool.query(`
    UPDATE ingredients
    SET name=$1, category=$2, calories=$3, dietary_tags=$4
    WHERE id=$5
    RETURNING *`,
    [name, category, calories, dietary_tags, id]
  );
  return result.rows[0];
}

export default {
  createIngredient,
  getIngredients,
  getIngredient,
  updateIngredient,
}
