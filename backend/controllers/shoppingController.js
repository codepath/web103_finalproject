import { pool, USER_ID } from "../config/db.js";
import { UNITS } from "../config/units.js";

const SELECT = `
  SELECT s.id, s.ingredient_id, i.name, i.category, s.quantity, s.unit, s.is_checked, s.source
  FROM shopping_list_items s JOIN ingredients i ON i.id = s.ingredient_id`;

// Adds to an unchecked row with the same ingredient and unit, or makes a new row
async function addOrCombine(ingredientId, quantity, unit, source) {
  const upd = await pool.query(
    `UPDATE shopping_list_items SET quantity = quantity + $1
     WHERE user_id = $2 AND ingredient_id = $3 AND unit = $4 AND is_checked = FALSE
     RETURNING id`,
    [quantity, USER_ID, ingredientId, unit]
  );
  if (upd.rows[0]) return upd.rows[0].id;
  const ins = await pool.query(
    `INSERT INTO shopping_list_items (user_id, ingredient_id, quantity, unit, source)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [USER_ID, ingredientId, quantity, unit, source]
  );
  return ins.rows[0].id;
}

export async function listShopping(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `${SELECT} WHERE s.user_id = $1 ORDER BY s.is_checked, i.category, i.name`,
      [USER_ID]
    );
    res.json(rows);
  } catch (e) { next(e); }
}

export async function addShoppingItem(req, res, next) {
  try {
    let { ingredient_id, name, category, quantity, unit } = req.body;
    quantity = Number(quantity);
    if (!(quantity > 0)) return res.status(400).json({ error: "Quantity must be more than 0." });
    if (!UNITS.includes(unit)) return res.status(400).json({ error: `Unit must be one of: ${UNITS.join(", ")}.` });

    if (!ingredient_id) {
      name = (name || "").trim();
      if (!name) return res.status(400).json({ error: "Choose an ingredient or enter a new name." });
      const found = await pool.query("SELECT id FROM ingredients WHERE LOWER(name) = LOWER($1)", [name]);
      if (found.rows[0]) ingredient_id = found.rows[0].id;
      else {
        const created = await pool.query(
          "INSERT INTO ingredients (name, category) VALUES ($1, $2) RETURNING id",
          [name, category || "Other"]
        );
        ingredient_id = created.rows[0].id;
      }
    }

    const id = await addOrCombine(ingredient_id, quantity, unit, "manual");
    const { rows } = await pool.query(`${SELECT} WHERE s.id = $1`, [id]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
}

// Adds every ingredient of the recipe that the pantry doesn't have
export async function addMissingFromRecipe(req, res, next) {
  try {
    const recipe = await pool.query("SELECT id FROM recipes WHERE id = $1", [req.params.recipeId]);
    if (!recipe.rows[0]) return res.status(404).json({ error: "Recipe not found." });

    const { rows: missing } = await pool.query(
      `SELECT ri.ingredient_id, ri.quantity, ri.unit
       FROM recipe_ingredients ri
       WHERE ri.recipe_id = $1
         AND NOT EXISTS (
           SELECT 1 FROM pantry_items p
           WHERE p.user_id = $2 AND p.ingredient_id = ri.ingredient_id AND p.quantity > 0
         )`,
      [req.params.recipeId, USER_ID]
    );
    for (const m of missing) await addOrCombine(m.ingredient_id, m.quantity, m.unit, "recipe");
    res.status(201).json({ added: missing.length });
  } catch (e) { next(e); }
}

export async function updateShoppingItem(req, res, next) {
  try {
    const { is_checked } = req.body;
    if (typeof is_checked !== "boolean") return res.status(400).json({ error: "is_checked must be true or false." });
    const upd = await pool.query(
      "UPDATE shopping_list_items SET is_checked = $1 WHERE id = $2 AND user_id = $3 RETURNING id",
      [is_checked, req.params.id, USER_ID]
    );
    if (!upd.rows[0]) return res.status(404).json({ error: "Shopping list item not found." });
    const { rows } = await pool.query(`${SELECT} WHERE s.id = $1`, [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
}

export async function deleteShoppingItem(req, res, next) {
  try {
    const del = await pool.query(
      "DELETE FROM shopping_list_items WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, USER_ID]
    );
    if (!del.rows[0]) return res.status(404).json({ error: "Shopping list item not found." });
    res.status(204).end();
  } catch (e) { next(e); }
}

export async function clearChecked(_req, res, next) {
  try {
    await pool.query("DELETE FROM shopping_list_items WHERE user_id = $1 AND is_checked = TRUE", [USER_ID]);
    res.status(204).end();
  } catch (e) { next(e); }
}
