
import {
  pool,
  getUserId,
} from "../config/db.js";

import {
  UNITS,
  convert,
} from "../config/units.js";

const SELECT = `
  SELECT
    s.id,
    s.ingredient_id,
    i.name,
    i.category,
    s.quantity,
    s.unit,
    s.is_checked,
    s.source

  FROM shopping_list_items s

  JOIN ingredients i
    ON i.id = s.ingredient_id
`;

// ==========================================
// ADD OR COMBINE SHOPPING ITEMS
// ==========================================

async function addOrCombine(
  ingredientId,
  quantity,
  unit,
  source
) {
  const userId = getUserId();

  const { rows } = await pool.query(
    `SELECT id, unit
     FROM shopping_list_items
     WHERE user_id = $1
       AND ingredient_id = $2
       AND is_checked = FALSE`,

    [
      userId,
      ingredientId,
    ]
  );

  // Combine matching or compatible units.

  for (const row of rows) {
    const extra = convert(
      quantity,
      unit,
      row.unit
    );

    if (extra !== null) {
      await pool.query(
        `UPDATE shopping_list_items

         SET quantity = quantity + $1

         WHERE id = $2
           AND user_id = $3`,

        [
          extra,
          row.id,
          userId,
        ]
      );

      return row.id;
    }
  }

  // Create a new shopping item.

  const inserted = await pool.query(
    `INSERT INTO shopping_list_items (
      user_id,
      ingredient_id,
      quantity,
      unit,
      source
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`,

    [
      userId,
      ingredientId,
      quantity,
      unit,
      source,
    ]
  );

  return inserted.rows[0].id;
}

// ==========================================
// GET SHOPPING LIST
// ==========================================

export async function listShopping(
  _req,
  res,
  next
) {
  try {
    const { rows } = await pool.query(
      `${SELECT}
       WHERE s.user_id = $1
       ORDER BY
         s.is_checked,
         i.category,
         i.name`,

      [getUserId()]
    );

    res.json(rows);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// ADD SHOPPING ITEM
// ==========================================

export async function addShoppingItem(
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
    } = req.body;

    quantity = Number(quantity);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        error:
          "Quantity must be more than 0.",
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

    const id = await addOrCombine(
      ingredient_id,
      quantity,
      unit,
      "manual"
    );

    const { rows } = await pool.query(
      `${SELECT}
       WHERE s.id = $1`,

      [id]
    );

    res.status(201).json(rows[0]);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// ADD MISSING RECIPE INGREDIENTS
// ==========================================

export async function addMissingFromRecipe(
  req,
  res,
  next
) {
  try {
    const recipe = await pool.query(
      "SELECT id FROM recipes WHERE id = $1",

      [req.params.recipeId]
    );

    if (!recipe.rows[0]) {
      return res.status(404).json({
        error: "Recipe not found.",
      });
    }

    const { rows: missing } =
      await pool.query(
        `SELECT
          ri.ingredient_id,
          ri.quantity,
          ri.unit

         FROM recipe_ingredients ri

         WHERE ri.recipe_id = $1

           AND NOT EXISTS (
             SELECT 1

             FROM pantry_items p

             WHERE p.user_id = $2
               AND p.ingredient_id =
                 ri.ingredient_id
               AND p.quantity > 0

               AND (
                 p.expiration_date IS NULL
                 OR p.expiration_date >= CURRENT_DATE
               )
           )`,

        [
          req.params.recipeId,
          getUserId(),
        ]
      );

    for (const item of missing) {
      await addOrCombine(
        item.ingredient_id,
        item.quantity,
        item.unit,
        "recipe"
      );
    }

    res.status(201).json({
      added: missing.length,
    });

  } catch (error) {
    next(error);
  }
}

// ==========================================
// UPDATE A SHOPPING ITEM
// ==========================================

export async function updateShoppingItem(
  req,
  res,
  next
) {
  try {
    const {
      is_checked,
      quantity,
    } = req.body;

    const updates = [];

    const values = [];

    if (is_checked !== undefined) {

      if (typeof is_checked !== "boolean") {
        return res.status(400).json({
          error:
            "is_checked must be true or false.",
        });
      }

      values.push(is_checked);

      updates.push(
        `is_checked = $${values.length}`
      );
    }

    if (quantity !== undefined) {

      if (
        typeof quantity !== "number" ||
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          error:
            "Quantity must be a positive number.",
        });
      }

      values.push(quantity);

      updates.push(
        `quantity = $${values.length}`
      );
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error:
          "Provide quantity or is_checked.",
      });
    }

    values.push(
      req.params.id,
      getUserId()
    );

    const result = await pool.query(
      `UPDATE shopping_list_items

       SET ${updates.join(", ")}

       WHERE id = $${values.length - 1}
         AND user_id = $${values.length}

       RETURNING id`,

      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error:
          "Shopping list item not found.",
      });
    }

    const { rows } = await pool.query(
      `${SELECT}
       WHERE s.id = $1`,

      [req.params.id]
    );

    res.json(rows[0]);

  } catch (error) {
    next(error);
  }
}

// ==========================================
// DELETE SHOPPING ITEM
// ==========================================

export async function deleteShoppingItem(
  req,
  res,
  next
) {
  try {
    const deleted = await pool.query(
      `DELETE FROM shopping_list_items

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
        error:
          "Shopping list item not found.",
      });
    }

    res.status(204).end();

  } catch (error) {
    next(error);
  }
}

// ==========================================
// MOVE PURCHASED ITEMS TO PANTRY
// ==========================================

export async function moveCheckedToPantry(
  _req,
  res,
  next
) {
  let client;

  try {
    const userId = getUserId();

    client = await pool.connect();

    await client.query("BEGIN");

    await client.query(
      "SELECT pg_advisory_xact_lock(23, $1::integer)",
      [userId]
    );

    const { rows: items } =
      await client.query(
        `SELECT
          id,
          ingredient_id,
          quantity,
          unit

         FROM shopping_list_items

         WHERE user_id = $1
           AND is_checked = TRUE

         FOR UPDATE`,

        [userId]
      );

    let moved = 0;

    for (const item of items) {

      const { rows } = await client.query(
        `SELECT id, unit

         FROM pantry_items

         WHERE user_id = $1
           AND ingredient_id = $2

         FOR UPDATE`,

        [
          userId,
          item.ingredient_id,
        ]
      );

      const pantry = rows[0];

      if (pantry) {

        const extra = convert(
          item.quantity,
          item.unit,
          pantry.unit
        );

        // Leave incompatible units on the list.

        if (extra === null) {
          continue;
        }

        await client.query(
          `UPDATE pantry_items

           SET quantity = quantity + $1,
               updated_at = CURRENT_TIMESTAMP

           WHERE id = $2
             AND user_id = $3`,

          [
            extra,
            pantry.id,
            userId,
          ]
        );

      } else {

        await client.query(
          `INSERT INTO pantry_items (
            user_id,
            ingredient_id,
            quantity,
            unit
          )

          VALUES ($1, $2, $3, $4)`,

          [
            userId,
            item.ingredient_id,
            item.quantity,
            item.unit,
          ]
        );
      }

      // Remove the purchased shopping item.

      await client.query(
        `DELETE FROM shopping_list_items

         WHERE id = $1
           AND user_id = $2`,

        [
          item.id,
          userId,
        ]
      );

      moved++;
    }

    await client.query("COMMIT");

    res.json({
      moved,

      skipped:
        items.length - moved,
    });

  } catch (error) {
    if (client) {
      await client
        .query("ROLLBACK")
        .catch(() => {});
    }

    next(error);

  } finally {
    client?.release();
  }
}

// ==========================================
// CLEAR PURCHASED SHOPPING ITEMS
// ==========================================

export async function clearChecked(
  _req,
  res,
  next
) {
  try {
    await pool.query(
      `DELETE FROM shopping_list_items

       WHERE user_id = $1
         AND is_checked = TRUE`,

      [getUserId()]
    );

    res.status(204).end();

  } catch (error) {
    next(error);
  }
}

// ==========================================
// GENERATE SHOPPING LIST FROM MEAL PLAN
// ==========================================

export async function generateShoppingList(
  req,
  res,
  next
) {
  const start = req.body?.start;

  if (
    start &&
    !/^\d{4}-\d{2}-\d{2}$/.test(start)
  ) {
    return res.status(400).json({
      error:
        "Start date must use YYYY-MM-DD.",
    });
  }

  let client;

  try {
    const userId = getUserId();

    client = await pool.connect();

    await client.query("BEGIN");

    // Prevent simultaneous list generations
    // for the same user.

    await client.query(
      "SELECT pg_advisory_xact_lock(19, $1::integer)",

      [userId]
    );

    // Default to Monday of the current week.

    const dateResult = await client.query(
      `SELECT COALESCE(

        $1::date,

        CURRENT_DATE -
          (
            EXTRACT(
              ISODOW FROM CURRENT_DATE
            )::integer - 1
          )

      )::text AS week_start`,

      [start || null]
    );

    const weekStart =
      dateResult.rows[0].week_start;

    // Calculate required ingredients
    // for the planned meals.

    const { rows: requirements } =
      await client.query(
        `SELECT

          ri.ingredient_id,

          ri.unit,

          SUM(ri.quantity)::float
            AS quantity

         FROM meal_plan_entries m

         JOIN recipe_ingredients ri
           ON ri.recipe_id = m.recipe_id

         WHERE m.user_id = $1

           AND m.planned_date >= $2::date

           AND m.planned_date < $2::date + 7

         GROUP BY
           ri.ingredient_id,
           ri.unit`,

        [
          userId,
          weekStart,
        ]
      );

    // Combine convertible measurement units.

    const needed = [];

    for (const item of requirements) {

      const amount = Number(
        item.quantity
      );

      const existing = needed.find(
        (row) =>

          row.ingredient_id ===
            item.ingredient_id &&

          convert(
            amount,
            item.unit,
            row.unit
          ) !== null
      );

      if (existing) {

        existing.quantity += convert(
          amount,
          item.unit,
          existing.unit
        );

      } else {

        needed.push({
          ingredient_id:
            item.ingredient_id,

          quantity: amount,

          unit: item.unit,
        });
      }
    }

    // Read available unexpired pantry quantities.

    const { rows: pantry } =
      await client.query(
        `SELECT

          ingredient_id,

          quantity::float AS quantity,

          unit

         FROM pantry_items

         WHERE user_id = $1

           AND quantity > 0

           AND (
             expiration_date IS NULL

             OR expiration_date >= CURRENT_DATE
           )`,

        [userId]
      );

    // Replace generated items only.
    // Keep the user's manual shopping items.

    await client.query(
      `DELETE FROM shopping_list_items

       WHERE user_id = $1

         AND source = 'generated'`,

      [userId]
    );

    let generated = 0;

    for (const item of needed) {

      let missing = item.quantity;

      // Subtract available stock from the
      // ingredients required for the week.

      for (const stock of pantry) {

        if (
          stock.ingredient_id !==
          item.ingredient_id
        ) {
          continue;
        }

        const available = convert(
          stock.quantity,

          stock.unit,

          item.unit
        );

        if (
          available === null ||

          available <= 0
        ) {
          continue;
        }

        const used = Math.min(
          missing,

          available
        );

        stock.quantity -= convert(
          used,

          item.unit,

          stock.unit
        );

        missing -= used;

        if (missing <= 0.000001) {
          break;
        }
      }

      const quantity = Number(
        Math.max(
          0,

          missing
        ).toFixed(2)
      );

      // Add the missing amount to shopping.

      if (quantity > 0) {

        await client.query(
          `INSERT INTO shopping_list_items (
            user_id,
            ingredient_id,
            quantity,
            unit,
            source
          )

          VALUES (
            $1, $2, $3, $4, 'generated'
          )`,

          [
            userId,

            item.ingredient_id,

            quantity,

            item.unit,
          ]
        );

        generated++;
      }
    }

    await client.query("COMMIT");

    res.json({
      message:
        "Shopping list generated successfully.",

      week_start: weekStart,

      generated,
    });

  } catch (error) {
    if (client) {
      await client
        .query("ROLLBACK")
        .catch(() => {});
    }

    next(error);

  } finally {
    client?.release();
  }
}
