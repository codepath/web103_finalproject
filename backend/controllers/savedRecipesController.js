import { pool, USER_ID } from '../config/db.js';

// Each saved row is joined with the recipe fields the Saved page card shows
const SELECT = `
  SELECT s.recipe_id, s.saved_at, r.title, r.image_url, r.prep_minutes
  FROM saved_recipes s JOIN recipes r ON r.id = s.recipe_id`;

const toId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// GET /api/saved-recipes  → newest saved first
export async function listSavedRecipes(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `${SELECT} WHERE s.user_id = $1 ORDER BY s.saved_at DESC`,
      [USER_ID]
    );
    res.json(rows);
  } catch (e) { next(e); }
}

// POST /api/saved-recipes { recipe_id }  → saving twice is a no-op (200 instead of 201)
export async function saveRecipe(req, res, next) {
  try {
    const recipe_id = toId(req.body.recipe_id);
    if (!recipe_id) return res.status(400).json({ error: 'recipe_id must be a positive integer.' });

    const recipe = await pool.query('SELECT id FROM recipes WHERE id = $1', [recipe_id]);
    if (!recipe.rows[0]) return res.status(404).json({ error: 'Recipe not found.' });

    const ins = await pool.query(
      `INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2)
       ON CONFLICT (user_id, recipe_id) DO NOTHING RETURNING recipe_id`,
      [USER_ID, recipe_id]
    );
    const { rows } = await pool.query(
      `${SELECT} WHERE s.user_id = $1 AND s.recipe_id = $2`,
      [USER_ID, recipe_id]
    );
    res.status(ins.rows[0] ? 201 : 200).json(rows[0]);
  } catch (e) { next(e); }
}

// DELETE /api/saved-recipes/:recipeId
export async function unsaveRecipe(req, res, next) {
  try {
    const recipe_id = toId(req.params.recipeId);
    if (!recipe_id) return res.status(400).json({ error: 'recipeId must be a positive integer.' });

    const del = await pool.query(
      'DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2 RETURNING recipe_id',
      [USER_ID, recipe_id]
    );
    if (!del.rows[0]) return res.status(404).json({ error: 'Saved recipe not found.' });
    res.status(204).end();
  } catch (e) { next(e); }
}
