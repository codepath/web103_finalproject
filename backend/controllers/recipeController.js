
import {
  pool,
  getUserId,
} from "../config/db.js";

const SORTS = [
  "time",
  "availability",
];

// ==========================================
// LIST RECIPES
// ==========================================

export async function listRecipes(
  req,
  res,
  next
) {
  try {
    const {
      mealType,
      diet,
      maxTime,
      sort,
    } = req.query;

    if (
      maxTime !== undefined &&
      !(
        Number.isInteger(Number(maxTime)) &&
        Number(maxTime) > 0
      )
    ) {
      return res.status(400).json({
        error:
          "maxTime must be a positive whole number of minutes.",
      });
    }

    if (
      sort !== undefined &&
      !SORTS.includes(sort)
    ) {
      return res.status(400).json({
        error:
          `sort must be one of: ${SORTS.join(", ")}.`,
      });
    }

    // Build optional recipe filters.

    const params = [getUserId()];

    const where = [];

    if (mealType) {
      params.push(mealType);

      where.push(
        `LOWER(r.meal_type) = LOWER($${params.length})`
      );
    }

    if (diet) {
      params.push(diet);

      where.push(
        `LOWER(r.dietary_preference) = LOWER($${params.length})`
      );
    }

    if (maxTime) {
      params.push(Number(maxTime));

      where.push(
        `COALESCE(r.prep_minutes, 0) +
         COALESCE(r.cook_minutes, 0)
         <= $${params.length}`
      );
    }

    // Choose the recipe sorting method.

    const orderBy =
      sort === "availability"

        ? `COUNT(p.ingredient_id)::float /
           NULLIF(COUNT(ri.ingredient_id), 0)
           DESC NULLS LAST, total_minutes`

        : sort === "time"

          ? "total_minutes, r.title"

          : "r.title";

    // Compare recipes with the user's pantry.

    const { rows } = await pool.query(
      `SELECT
        r.*,

        COALESCE(r.prep_minutes, 0) +
          COALESCE(r.cook_minutes, 0)
          AS total_minutes,

        COUNT(ri.ingredient_id)::int
          AS total_count,

        COUNT(p.ingredient_id)::int
          AS have_count,

        COUNT(p.ingredient_id)::int
          AS matched_count,

        (
          COUNT(ri.ingredient_id) -
          COUNT(p.ingredient_id)
        )::int AS missing_count,

        COALESCE(
          ARRAY_AGG(i.name ORDER BY i.name)
            FILTER (
              WHERE p.ingredient_id IS NULL
                AND ri.ingredient_id IS NOT NULL
            ),

          '{}'
        ) AS missing_ingredients,

        EXISTS (
          SELECT 1
          FROM saved_recipes s
          WHERE s.recipe_id = r.id
            AND s.user_id = $1
        ) AS is_saved

      FROM recipes r

      LEFT JOIN recipe_ingredients ri
        ON ri.recipe_id = r.id

      LEFT JOIN ingredients i
        ON i.id = ri.ingredient_id

      LEFT JOIN (
        SELECT DISTINCT ingredient_id
        FROM pantry_items
        WHERE user_id = $1
          AND quantity > 0
          AND (
            expiration_date IS NULL
            OR expiration_date >= CURRENT_DATE
          )
      ) p
        ON p.ingredient_id = ri.ingredient_id

      ${
        where.length
          ? `WHERE ${where.join(" AND ")}`
          : ""
      }

      GROUP BY r.id

      ORDER BY ${orderBy}`,

      params
    );

    res.json(rows);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// GET ONE RECIPE
// ==========================================

export async function getRecipe(
  req,
  res,
  next
) {
  try {
    const id = Number(req.params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        error:
          "Recipe id must be a positive whole number.",
      });
    }

    const recipe = await pool.query(
      `SELECT
        r.*,

        EXISTS (
          SELECT 1
          FROM saved_recipes s
          WHERE s.recipe_id = r.id
            AND s.user_id = $2
        ) AS is_saved

      FROM recipes r

      WHERE r.id = $1`,

      [
        id,
        getUserId(),
      ]
    );

    if (!recipe.rows[0]) {
      return res.status(404).json({
        error: "Recipe not found.",
      });
    }

    // Retrieve the recipe ingredients and
    // check whether the user has them.

    const { rows: ingredients } =
      await pool.query(
        `SELECT
          i.id,
          i.name,
          i.category,
          ri.quantity,
          ri.unit,

          (p.ingredient_id IS NOT NULL)
            AS have

        FROM recipe_ingredients ri

        JOIN ingredients i
          ON i.id = ri.ingredient_id

        LEFT JOIN (
          SELECT DISTINCT ingredient_id
          FROM pantry_items
          WHERE user_id = $2
            AND quantity > 0
            AND (
              expiration_date IS NULL
              OR expiration_date >= CURRENT_DATE
            )
        ) p
          ON p.ingredient_id = ri.ingredient_id

        WHERE ri.recipe_id = $1

        ORDER BY i.name`,

        [
          id,
          getUserId(),
        ]
      );

    res.json({
      ...recipe.rows[0],

      ingredients,
    });

  } catch (error) {
    next(error);
  }
}
