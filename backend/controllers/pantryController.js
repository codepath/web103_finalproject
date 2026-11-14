
import {
  pool,
  getUserId,
} from "../config/db.js";

import { UNITS } from "../config/units.js";

const SELECT = `
  SELECT
    p.id,
    p.ingredient_id,
    i.name,
    i.category,
    p.quantity,
    p.unit,
    p.expiration_date,
    p.updated_at,

    CASE
      WHEN p.expiration_date IS NULL THEN NULL
      ELSE p.expiration_date - CURRENT_DATE
    END AS days_until_expiry

  FROM pantry_items p

  JOIN ingredients i
    ON i.id = p.ingredient_id
`;

// ==========================================
// LIST PANTRY ITEMS
// ==========================================

export async function listPantry(
  _req,
  res,
  next
) {
  try {
    const { rows } = await pool.query(
      `${SELECT}
       WHERE p.user_id = $1
       ORDER BY i.category, i.name`,

      [getUserId()]
    );

    res.json(rows);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// ADD PANTRY INGREDIENT
// ==========================================

export async function addPantryItem(
  req,
  res,
  next
) {
  try {
    let {
      ingredient_id,
      name,
      category,
      quantity,
      unit,
      expiration_date,
    } = req.body;

    quantity = Number(quantity);

    if (
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        error: "Quantity must be a number ≥ 0.",
      });
    }

    if (!UNITS.includes(unit)) {
      return res.status(400).json({
        error:
          `Unit must be one of: ${UNITS.join(", ")}.`,
      });
    }

    // Find or create the ingredient.

    if (!ingredient_id) {
      name = (name || "").trim();

      if (!name) {
        return res.status(400).json({
          error:
            "Choose an ingredient or enter a new name.",
        });
      }

      const found = await pool.query(
        `SELECT id
         FROM ingredients
         WHERE LOWER(name) = LOWER($1)`,

        [name]
      );

      if (found.rows[0]) {
        ingredient_id = found.rows[0].id;

      } else {
        const created = await pool.query(
          `INSERT INTO ingredients (
            name,
            category
          )
          VALUES ($1, $2)
          RETURNING id`,

          [
            name,
            category || "Other",
          ]
        );

        ingredient_id = created.rows[0].id;
      }
    }

    // Prevent duplicate pantry ingredients.

    const duplicate = await pool.query(
      `SELECT id
       FROM pantry_items
       WHERE user_id = $1
         AND ingredient_id = $2`,

      [
        getUserId(),
        ingredient_id,
      ]
    );

    if (duplicate.rows[0]) {
      return res.status(409).json({
        error:
          "That ingredient is already in your pantry — edit it instead.",
      });
    }

    // Insert the pantry item.

    const inserted = await pool.query(
      `INSERT INTO pantry_items (
        user_id,
        ingredient_id,
        quantity,
        unit,
        expiration_date
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,

      [
        getUserId(),
        ingredient_id,
        quantity,
        unit,
        expiration_date || null,
      ]
    );

    const { rows } = await pool.query(
      `${SELECT}
       WHERE p.id = $1`,

      [inserted.rows[0].id]
    );

    res.status(201).json(rows[0]);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// UPDATE PANTRY INGREDIENT
// ==========================================

export async function updatePantryItem(
  req,
  res,
  next
) {
  try {
    const {
      quantity,
      unit,
      expiration_date,
    } = req.body;

    if (
      quantity !== undefined &&
      (
        !Number.isFinite(Number(quantity)) ||
        Number(quantity) < 0
      )
    ) {
      return res.status(400).json({
        error: "Quantity must be a number ≥ 0.",
      });
    }

    if (
      unit !== undefined &&
      !UNITS.includes(unit)
    ) {
      return res.status(400).json({
        error:
          `Unit must be one of: ${UNITS.join(", ")}.`,
      });
    }

    const updated = await pool.query(
      `UPDATE pantry_items
       SET
         quantity = COALESCE($1, quantity),

         unit = COALESCE($2, unit),

         expiration_date = CASE
           WHEN $3::boolean THEN $4::date
           ELSE expiration_date
         END,

         updated_at = CURRENT_TIMESTAMP

       WHERE id = $5
         AND user_id = $6

       RETURNING id`,

      [
        quantity ?? null,

        unit ?? null,

        "expiration_date" in req.body,

        expiration_date || null,

        req.params.id,

        getUserId(),
      ]
    );

    if (!updated.rows[0]) {
      return res.status(404).json({
        error: "Pantry item not found.",
      });
    }

    const { rows } = await pool.query(
      `${SELECT}
       WHERE p.id = $1`,

      [req.params.id]
    );

    res.json(rows[0]);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// DELETE PANTRY INGREDIENT
// ==========================================

export async function deletePantryItem(
  req,
  res,
  next
) {
  try {
    const deleted = await pool.query(
      `DELETE FROM pantry_items
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
        error: "Pantry item not found.",
      });
    }

    res.status(204).end();

  } catch (error) {
    next(error);
  }
}
