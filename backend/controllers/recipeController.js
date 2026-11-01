import { pool, USER_ID } from "../config/db.js";

const SORTS = ["time", "availability"];

export async function listRecipes(req, res, next) {
  try {
    const { mealType, diet, maxTime, sort } = req.query;
    if (maxTime !== undefined && !(Number.isInteger(Number(maxTime)) && Number(maxTime) > 0))
      return res.status(400).json({ error: "maxTime must be a positive whole number of minutes." });
    if (sort !== undefined && !SORTS.includes(sort))
      return res.status(400).json({ error: `sort must be one of: ${SORTS.join(", ")}.` });

    // Build the WHERE clause from whichever filters were sent
    const params = [USER_ID];
    const where = [];
    if (mealType) { params.push(mealType); where.push(`LOWER(r.meal_type) = LOWER($${params.length})`); }
    if (diet) { params.push(diet); where.push(`LOWER(r.dietary_preference) = LOWER($${params.length})`); }
    if (maxTime) { params.push(Number(maxTime)); where.push(`COALESCE(r.prep_minutes,0) + COALESCE(r.cook_minutes,0) <= $${params.length}`); }

    const orderBy = sort === "availability"
      ? "COUNT(p.id)::float / NULLIF(COUNT(ri.ingredient_id), 0) DESC NULLS LAST, total_minutes"
      : sort === "time" ? "total_minutes, r.title" : "r.title";

    const { rows } = await pool.query(
      `SELECT r.*,
              COALESCE(r.prep_minutes,0) + COALESCE(r.cook_minutes,0) AS total_minutes,
              COUNT(ri.ingredient_id)::int AS total_count,
              COUNT(p.id)::int AS have_count
       FROM recipes r
       LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
       LEFT JOIN pantry_items p ON p.ingredient_id = ri.ingredient_id AND p.user_id = $1 AND p.quantity > 0
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       GROUP BY r.id
       ORDER BY ${orderBy}`,
      params
    );
    res.json(rows);
  } catch (e) { next(e); }
}

export async function getRecipe(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Recipe id must be a positive whole number." });

    const recipe = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);
    if (!recipe.rows[0]) return res.status(404).json({ error: "Recipe not found." });

    // have = the user's pantry holds this ingredient with quantity above 0
    const { rows: ingredients } = await pool.query(
      `SELECT i.id, i.name, i.category, ri.quantity, ri.unit,
              (p.id IS NOT NULL) AS have
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       LEFT JOIN pantry_items p ON p.ingredient_id = ri.ingredient_id AND p.user_id = $2 AND p.quantity > 0
       WHERE ri.recipe_id = $1
       ORDER BY i.name`,
      [id, USER_ID]
    );
    res.json({ ...recipe.rows[0], ingredients });
  } catch (e) { next(e); }
}
