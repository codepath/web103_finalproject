
import {
  pool,
  getUserId,
} from "../config/db.js";

const MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const SELECT = `
  SELECT
    m.id,
    m.recipe_id,

    TO_CHAR(
      m.planned_date,
      'YYYY-MM-DD'
    ) AS planned_date,

    LOWER(m.meal_type) AS meal_type,

    r.title,
    r.image_url,
    r.prep_minutes

  FROM meal_plan_entries m

  JOIN recipes r
    ON r.id = m.recipe_id
`;

function isValidDate(value) {
  if (
    typeof value !== "string" ||
    !DATE_RE.test(value) ||
    Number.isNaN(Date.parse(value))
  ) {
    return false;
  }

  return (
    new Date(value + "T00:00:00Z")
      .toISOString()
      .slice(0, 10) === value
  );
}

function normalizeMealType(value) {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

// ==========================================
// GET WEEKLY MEAL PLAN
// ==========================================

export async function getMealPlan(
  req,
  res,
  next
) {
  try {
    const { start } = req.query;

    if (!isValidDate(start)) {
      return res.status(400).json({
        error:
          "start must be a date in YYYY-MM-DD format.",
      });
    }

    const { rows } = await pool.query(
      `${SELECT}
       WHERE m.user_id = $1

         AND m.planned_date BETWEEN $2::date
           AND $2::date + 6

       ORDER BY
         m.planned_date,

         ARRAY_POSITION(
           $3::text[],
           LOWER(m.meal_type)
         ),

         m.id`,

      [
        getUserId(),
        start,
        MEAL_TYPES,
      ]
    );

    res.json(rows);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// ADD A PLANNED MEAL
// ==========================================

export async function addMealPlanEntry(
  req,
  res,
  next
) {
  try {
    const recipeId = Number(
      req.body.recipe_id
    );

    const { planned_date } = req.body;

    const mealType = normalizeMealType(
      req.body.meal_type
    );

    if (
      !Number.isInteger(recipeId) ||
      recipeId <= 0
    ) {
      return res.status(400).json({
        error:
          "recipe_id must be a positive integer.",
      });
    }

    if (!isValidDate(planned_date)) {
      return res.status(400).json({
        error:
          "planned_date must be a date in YYYY-MM-DD format.",
      });
    }

    if (!MEAL_TYPES.includes(mealType)) {
      return res.status(400).json({
        error:
          `meal_type must be one of: ${MEAL_TYPES.join(", ")}.`,
      });
    }

    // Verify that the recipe exists.

    const recipe = await pool.query(
      "SELECT id FROM recipes WHERE id = $1",

      [recipeId]
    );

    if (!recipe.rows[0]) {
      return res.status(404).json({
        error: "Recipe not found.",
      });
    }

    const inserted = await pool.query(
      `INSERT INTO meal_plan_entries (
        user_id,
        recipe_id,
        planned_date,
        meal_type
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id`,

      [
        getUserId(),
        recipeId,
        planned_date,
        mealType,
      ]
    );

    const { rows } = await pool.query(
      `${SELECT}
       WHERE m.id = $1`,

      [inserted.rows[0].id]
    );

    res.status(201).json(rows[0]);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// MOVE OR UPDATE A PLANNED MEAL
// ==========================================

export async function updateMealPlanEntry(
  req,
  res,
  next
) {
  try {
    const { planned_date } = req.body;

    let { meal_type } = req.body;

    if (
      planned_date === undefined &&
      meal_type === undefined
    ) {
      return res.status(400).json({
        error:
          "Provide planned_date and/or meal_type.",
      });
    }

    if (
      planned_date !== undefined &&
      !isValidDate(planned_date)
    ) {
      return res.status(400).json({
        error:
          "planned_date must be a date in YYYY-MM-DD format.",
      });
    }

    if (meal_type !== undefined) {
      meal_type = normalizeMealType(meal_type);

      if (!MEAL_TYPES.includes(meal_type)) {
        return res.status(400).json({
          error:
            `meal_type must be one of: ${MEAL_TYPES.join(", ")}.`,
        });
      }
    }

    const updated = await pool.query(
      `UPDATE meal_plan_entries

       SET planned_date =
         COALESCE($1::date, planned_date),

         meal_type =
           COALESCE($2, meal_type)

       WHERE id = $3
         AND user_id = $4

       RETURNING id`,

      [
        planned_date ?? null,

        meal_type ?? null,

        req.params.id,

        getUserId(),
      ]
    );

    if (!updated.rows[0]) {
      return res.status(404).json({
        error: "Meal plan entry not found.",
      });
    }

    const { rows } = await pool.query(
      `${SELECT}
       WHERE m.id = $1`,

      [updated.rows[0].id]
    );

    res.json(rows[0]);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// DELETE A PLANNED MEAL
// ==========================================

export async function deleteMealPlanEntry(
  req,
  res,
  next
) {
  try {
    const deleted = await pool.query(
      `DELETE FROM meal_plan_entries
       WHERE id = $1
         AND user_id = $2
       RETURNING id`,

      [
        req.params.id,
        getUserId(),
      ]
    );

    if (!deleted.rows[0]) {
      return res.status(404).json({
        error: "Meal plan entry not found.",
      });
    }

    res.status(204).end();

  } catch (error) {
    next(error);
  }
}
