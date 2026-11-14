
import {
  pool,
  getUserId,
} from "../config/db.js";

const SELECT = `
  SELECT
    s.recipe_id,
    s.saved_at,
    r.title,
    r.image_url,
    r.prep_minutes

  FROM saved_recipes s

  JOIN recipes r
    ON r.id = s.recipe_id
`;

function toId(value) {
  const number = Number(value);

  return (
    Number.isInteger(number) &&
    number > 0
  )
    ? number
    : null;
}

// ==========================================
// GET SAVED RECIPES
// ==========================================

export async function listSavedRecipes(
  _req,
  res,
  next
) {
  try {
    const { rows } = await pool.query(
      `${SELECT}
       WHERE s.user_id = $1
       ORDER BY s.saved_at DESC`,

      [getUserId()]
    );

    res.json(rows);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// SAVE A FAVORITE RECIPE
// ==========================================

export async function saveRecipe(
  req,
  res,
  next
) {
  try {
    const recipeId = toId(
      req.body.recipe_id
    );

    if (!recipeId) {
      return res.status(400).json({
        error:
          "recipe_id must be a positive integer.",
      });
    }

    const recipe = await pool.query(
      "SELECT id FROM recipes WHERE id = $1",

      [recipeId]
    );

    if (!recipe.rows[0]) {
      return res.status(404).json({
        error: "Recipe not found.",
      });
    }

    // Saving twice does not create duplicates.

    const inserted = await pool.query(
      `INSERT INTO saved_recipes (
        user_id,
        recipe_id
      )
      VALUES ($1, $2)

      ON CONFLICT (user_id, recipe_id)
      DO NOTHING

      RETURNING recipe_id`,

      [
        getUserId(),
        recipeId,
      ]
    );

    const { rows } = await pool.query(
      `${SELECT}
       WHERE s.user_id = $1
         AND s.recipe_id = $2`,

      [
        getUserId(),
        recipeId,
      ]
    );

    res
      .status(inserted.rows[0] ? 201 : 200)
      .json(rows[0]);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// REMOVE SAVED RECIPE
// ==========================================

export async function unsaveRecipe(
  req,
  res,
  next
) {
  try {
    const recipeId = toId(
      req.params.recipeId
    );

    if (!recipeId) {
      return res.status(400).json({
        error:
          "recipeId must be a positive integer.",
      });
    }

    const deleted = await pool.query(
      `DELETE FROM saved_recipes

       WHERE user_id = $1
         AND recipe_id = $2

       RETURNING recipe_id`,

      [
        getUserId(),
        recipeId,
      ]
    );

    if (!deleted.rows[0]) {
      return res.status(404).json({
        error: "Saved recipe not found.",
      });
    }

    res.status(204).end();

  } catch (error) {
    next(error);
  }
}
