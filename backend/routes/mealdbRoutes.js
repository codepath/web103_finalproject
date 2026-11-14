
import express from "express";
import { pool } from "../config/db.js";
import { convert } from "../config/units.js";

const router = express.Router();

const MEALDB =
  "https://www.themealdb.com/api/json/v1/1";

const MAX_QUANTITY = 99999999.99;

// ============================================
// SUPPORTED UNITS
// ============================================

const ALLOWED_UNITS = [
  "g", "kg", "ml", "l",
  "tsp", "tbsp", "cup",
  "pieces", "cloves", "slices",
  "bulb", "bunch", "sprigs",
  "pinch", "stalks",
];

// ============================================
// INGREDIENT ALIASES
// ============================================

const ALIASES = {
  egg: "Eggs",
  eggs: "Eggs",
  onion: "Onion",
  onions: "Onion",
  tomato: "Tomato",
  tomatoes: "Tomato",
  garlic: "Garlic",
  avocado: "Avocado",
  avocados: "Avocado",
  banana: "Banana",
  bananas: "Banana",
  lime: "Lime",
  limes: "Lime",
  lemon: "Lemon",
  lemons: "Lemon",
  "spring onion": "Spring Onions",
  "spring onions": "Spring Onions",
  scallion: "Spring Onions",
  scallions: "Spring Onions",
};

function normalizeName(value = "") {
  const name = value.trim();
  const key = name.toLowerCase();

  return Object.hasOwn(ALIASES, key)
    ? ALIASES[key]
    : name;
}

// ============================================
// EXTRACT MEALDB INGREDIENTS
// ============================================

function getIngredients(meal) {
  return Array.from({ length: 20 }, (_, i) => {
    const name =
      meal[`strIngredient${i + 1}`]?.trim();

    const measure =
      meal[`strMeasure${i + 1}`]?.trim();

    return {
      name,
      measure: measure || "",
    };
  }).filter((item) => item.name);
}

// ============================================
// QUANTITY VALIDATION
// ============================================

function validQuantity(quantity) {
  return (
    Number.isFinite(quantity) &&
    quantity >= 0.01 &&
    quantity <= MAX_QUANTITY
  );
}

// ============================================
// PARSE INGREDIENT MEASUREMENTS
// ============================================

function parseMeasure(measure = "", name = "") {
  let text = String(measure)
    .toLowerCase()
    .replace(/½/g, " 1/2")
    .replace(/¼/g, " 1/4")
    .replace(/¾/g, " 3/4")
    .replace(/⅓/g, " 1/3")
    .replace(/⅔/g, " 2/3")
    .replace(/⅛/g, " 1/8")
    .replace(/⅜/g, " 3/8")
    .replace(/⅝/g, " 5/8")
    .replace(/⅞/g, " 7/8")
    .replace(/\s+/g, " ")
    .trim();

  // Handle "Pinch" without a number.

  if (/^(a\s+)?pinch(\s+of)?$/.test(text)) {
    return {
      quantity: 1,
      unit: "pinch",
    };
  }

  // Handle citrus juice measured by fruit count.
  // Example: "Juice of 1 lime".

  if (
    /^(lime|lemon)$/i.test(name) &&
    /^juice of\s+/i.test(text)
  ) {
    text = text
      .replace(/^juice of\s+/, "")
      .replace(/\s+(limes?|lemons?)$/, "");
  }

  // Do not invent measurements for vague amounts.

  if (
    !text ||
    /to taste|as needed|as required|handful/.test(text)
  ) {
    return null;
  }

  const match = text.match(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*(.*)$/
  );

  if (!match) return null;

  let quantity = match[1]
    .split(/\s+/)
    .reduce((total, part) => {
      if (part.includes("/")) {
        const [a, b] = part
          .split("/")
          .map(Number);

        return total + a / b;
      }

      return total + Number(part);
    }, 0);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  let unitText = match[2]
    .trim()
    .replace(
      /\b(thinly|finely|roughly|freshly|chopped|sliced|minced|diced|grated|peeled|dried|crushed|large|medium|small)\b/g,
      ""
    )
    .replace(/\s+/g, " ")
    .replace(/\.$/, "")
    .trim();

  const units = {
    g: "g",
    gram: "g",
    grams: "g",

    kg: "kg",
    kilogram: "kg",
    kilograms: "kg",

    ml: "ml",
    milliliter: "ml",
    milliliters: "ml",
    millilitre: "ml",
    millilitres: "ml",

    l: "l",
    liter: "l",
    liters: "l",
    litre: "l",
    litres: "l",

    tsp: "tsp",
    tsps: "tsp",
    teaspoon: "tsp",
    teaspoons: "tsp",

    tbsp: "tbsp",
    tbs: "tbsp",
    tbl: "tbsp",
    tblsp: "tbsp",
    tblsps: "tbsp",
    tbsps: "tbsp",
    tablespoon: "tbsp",
    tablespoons: "tbsp",

    cup: "cup",
    cups: "cup",

    piece: "pieces",
    pieces: "pieces",

    clove: "cloves",
    cloves: "cloves",

    slice: "slices",
    slices: "slices",

    bulb: "bulb",
    bulbs: "bulb",

    bunch: "bunch",
    bunches: "bunch",

    sprig: "sprigs",
    sprigs: "sprigs",

    pinch: "pinch",
    pinches: "pinch",

    stalk: "stalks",
    stalks: "stalks",

    "": "pieces",
  };

  let unit = Object.hasOwn(units, unitText)
    ? units[unitText]
    : null;

  // Convert pounds to grams.

  if (
    ["lb", "lbs", "pound", "pounds"].includes(unitText)
  ) {
    quantity *= 453.59237;
    unit = "g";
  }

  // Convert ounces to grams.

  if (
    ["oz", "ounce", "ounces"].includes(unitText)
  ) {
    quantity *= 28.349523;
    unit = "g";
  }

  if (!unit) return null;

  quantity = Number(quantity.toFixed(2));

  if (!validQuantity(quantity)) {
    return null;
  }

  return {
    quantity,
    unit,
  };
}

// ============================================
// CHECK SUSPICIOUS MEASUREMENTS
// ============================================

function measurementProblem(name, parsed) {
  if (!parsed) {
    return "Enter the original recipe measurement.";
  }

  const ingredient = name.toLowerCase();
  const { quantity, unit } = parsed;

  if (!validQuantity(quantity)) {
    return "Enter a valid positive quantity.";
  }

  if (!ALLOWED_UNITS.includes(unit)) {
    return "Select a supported measurement unit.";
  }

  // Prevent obvious count-unit errors for liquids.
  // Example: 1 piece of olive oil.

  if (
    /\b(oil|sauce|vinegar|milk|stock|broth)\b/.test(
      ingredient
    ) &&
    ["pieces", "cloves", "slices", "bulb"].includes(
      unit
    )
  ) {
    return "Use an appropriate weight or volume unit.";
  }

  // Ground spices cannot be measured as pieces.

  if (
    /^ground\s+/.test(ingredient) &&
    unit === "pieces"
  ) {
    return "Use teaspoons, tablespoons or grams.";
  }

  // Flag excessive seasoning quantities.

  const isSeasoning =
    /^(salt|pepper|black pepper|white pepper|allspice|turmeric powder|curry powder|cardamom|ground ginger)$/.test(
      ingredient
    );

  if (isSeasoning) {
    const grams = convert(quantity, unit, "g");
    const ml = convert(quantity, unit, "ml");

    if (grams !== null && grams > 250) {
      return "Unusually large seasoning amount. Review the original recipe.";
    }

    if (ml !== null && ml > 120) {
      return "Unusually large seasoning amount. Check teaspoons versus cups.";
    }
  }

  return null;
}

// ============================================
// PREPARE INGREDIENTS
// ============================================

function prepareIngredients(meal, measurements) {
  return getIngredients(meal).map((item, index) => {
    const name = normalizeName(item.name);

    let parsed = parseMeasure(item.measure, name);

    // Allow user-reviewed measurements to
    // override the original parsed measurement.

    if (
      measurements &&
      Object.hasOwn(measurements, index)
    ) {
      const reviewed = measurements[index];

      const quantity = Number(reviewed?.quantity);

      const unit = reviewed?.unit;

      if (
        validQuantity(quantity) &&
        ALLOWED_UNITS.includes(unit)
      ) {
        parsed = {
          quantity: Number(quantity.toFixed(2)),
          unit,
        };
      } else {
        parsed = null;
      }
    }

    return {
      ...item,
      name,
      index,
      parsed,
      reason: measurementProblem(name, parsed),
    };
  });
}

// ============================================
// MERGE DUPLICATE INGREDIENTS
// ============================================

function mergeIngredients(ingredients) {
  const merged = new Map();
  const conflicts = new Map();

  for (const item of ingredients) {
    if (!item.parsed || item.reason) continue;

    const key = item.name.toLowerCase();

    const existing = merged.get(key);

    // First occurrence.

    if (!existing) {
      merged.set(key, {
        name: item.name,
        parsed: { ...item.parsed },
      });

      continue;
    }

    // Combine only compatible measurements.

    const converted = convert(
      item.parsed.quantity,
      item.parsed.unit,
      existing.parsed.unit
    );

    if (converted === null) {
      conflicts.set(
        key,
        "Repeated ingredient. Use compatible units for each occurrence."
      );

      continue;
    }

    const combined = {
      quantity: Number(
        (
          existing.parsed.quantity + converted
        ).toFixed(2)
      ),
      unit: existing.parsed.unit,
    };

    const problem = measurementProblem(
      item.name,
      combined
    );

    if (problem) {
      conflicts.set(key, problem);
      continue;
    }

    existing.parsed = combined;
  }

  const unsupported = ingredients
    .filter(
      (item) =>
        !item.parsed ||
        item.reason ||
        conflicts.has(item.name.toLowerCase())
    )
    .map((item) => ({
      ...item,

      reason:
        item.reason ||
        conflicts.get(item.name.toLowerCase()) ||
        "Review the original measurement.",
    }));

  return {
    merged: [...merged.values()],
    unsupported,
  };
}

// ============================================
// SEARCH RECIPES
// ============================================

router.get("/search", async (req, res) => {
  try {
    const query =
      typeof req.query.q === "string"
        ? req.query.q.trim()
        : "";

    if (!query) {
      return res.json([]);
    }

    const response = await fetch(
      `${MEALDB}/search.php?s=${encodeURIComponent(
        query
      )}`,
      {
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      throw new Error("TheMealDB request failed");
    }

    const data = await response.json();

    const meals = (data.meals || []).map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image_url: meal.strMealThumb,
      category: meal.strCategory,
      instructions: meal.strInstructions,
      ingredients: getIngredients(meal),
    }));

    res.json(meals);

  } catch (error) {
    console.error(
      "MealDB search error:",
      error.message
    );

    res.status(502).json({
      error: "Failed to fetch recipes from TheMealDB",
    });
  }
});

// ============================================
// IMPORT RECIPE
// ============================================

router.post(
  "/import/:mealId",
  async (req, res, next) => {
    let client;

    try {
      const mealId = req.params.mealId;

      if (!/^\d+$/.test(mealId)) {
        return res.status(400).json({
          error: "Invalid MealDB recipe ID",
        });
      }

      // ======================================
      // PREVENT DUPLICATE RECIPE IMPORTS
      // ======================================

      const existing = await pool.query(
        `SELECT *
         FROM recipes
         WHERE mealdb_id = $1`,
        [mealId]
      );

      if (existing.rows.length) {
        return res.json({
          message: "Recipe already imported",
          recipe: existing.rows[0],
        });
      }

      // ======================================
      // FETCH COMPLETE RECIPE
      // ======================================

      const response = await fetch(
        `${MEALDB}/lookup.php?i=${mealId}`,
        {
          signal: AbortSignal.timeout(15000),
        }
      );

      if (!response.ok) {
        return res.status(502).json({
          error: "TheMealDB request failed",
        });
      }

      const data = await response.json();

      const meal = data.meals?.[0];

      if (!meal) {
        return res.status(404).json({
          error: "Recipe not found",
        });
      }

      // ======================================
      // PREPARE MEASUREMENTS
      // ======================================

      const measurements =
        req.body?.measurements || {};

      const ingredients = prepareIngredients(
        meal,
        measurements
      );

      if (!ingredients.length) {
        return res.status(422).json({
          error: "This recipe has no ingredients.",
          ingredients: [],
        });
      }

      // ======================================
      // MERGE DUPLICATE INGREDIENTS
      // ======================================

      const { merged, unsupported } =
        mergeIngredients(ingredients);

      if (unsupported.length) {
        return res.status(422).json({
          error:
            "Review ingredient measurements before importing.",
          ingredients: unsupported,
        });
      }

      // ======================================
      // BEGIN DATABASE TRANSACTION
      // ======================================

      client = await pool.connect();

      await client.query("BEGIN");

      // ======================================
      // INSERT RECIPE
      // ======================================

      const result = await client.query(
        `INSERT INTO recipes (
          title,
          description,
          instructions,
          image_url,
          mealdb_id
        )
        VALUES ($1, $2, $3, $4, $5)

        ON CONFLICT (mealdb_id)
        DO NOTHING

        RETURNING *`,

        [
          meal.strMeal,

          `${
            meal.strCategory || "Recipe"
          } from TheMealDB`,

          meal.strInstructions || "",

          meal.strMealThumb,

          mealId,
        ]
      );

      // Handle simultaneous imports.

      if (!result.rows.length) {
        const imported = await client.query(
          `SELECT *
           FROM recipes
           WHERE mealdb_id = $1`,
          [mealId]
        );

        await client.query("COMMIT");

        return res.json({
          message: "Recipe already imported",
          recipe: imported.rows[0],
        });
      }

      const recipe = result.rows[0];

      // ======================================
      // ADD INGREDIENTS
      // ======================================

      for (const ingredient of merged) {
        const name = ingredient.name;

        const found = await client.query(
          `SELECT id
           FROM ingredients
           WHERE LOWER(name) = LOWER($1)
           ORDER BY id
           LIMIT 1`,
          [name]
        );

        let ingredientId;

        if (found.rows.length) {
          ingredientId = found.rows[0].id;
        } else {
          const inserted = await client.query(
            `INSERT INTO ingredients (name)

             VALUES ($1)

             ON CONFLICT (name)
             DO UPDATE SET name = EXCLUDED.name

             RETURNING id`,
            [name]
          );

          ingredientId = inserted.rows[0].id;
        }

        // Each merged ingredient is inserted
        // only once for each recipe.

        await client.query(
          `INSERT INTO recipe_ingredients (
            recipe_id,
            ingredient_id,
            quantity,
            unit
          )
          VALUES ($1, $2, $3, $4)`,

          [
            recipe.id,
            ingredientId,
            ingredient.parsed.quantity,
            ingredient.parsed.unit,
          ]
        );
      }

      // ======================================
      // COMMIT SUCCESSFUL IMPORT
      // ======================================

      await client.query("COMMIT");

      console.log(
        `Imported ${recipe.title} with ${merged.length} ingredients.`
      );

      res.status(201).json({
        message: "Recipe imported successfully",
        recipe,
        ingredientsImported: merged.length,
      });

    } catch (error) {
      if (client) {
        await client
          .query("ROLLBACK")
          .catch(() => {});
      }

      console.error(
        "MealDB import error:",
        error.message
      );

      next(error);

    } finally {
      client?.release();
    }
  }
);

export default router;
