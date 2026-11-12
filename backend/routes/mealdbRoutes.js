
import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

const MEALDB = "https://www.themealdb.com/api/json/v1/1";

// Extract ingredients from MealDB
function getIngredients(meal) {
  return Array.from({ length: 20 }, (_, i) => {
    const name = meal[`strIngredient${i + 1}`]?.trim();
    const measure = meal[`strMeasure${i + 1}`]?.trim();

    return { name, measure: measure || "" };
  }).filter((item) => item.name);
}

// Convert common MealDB measurements into PrepWise units

function parseMeasure(measure = "") {
  const text = measure
    .toLowerCase()
    .replace(/½/g, " 1/2")
    .replace(/¼/g, " 1/4")
    .replace(/¾/g, " 3/4")
    .replace(/⅓/g, " 1/3")
    .replace(/⅔/g, " 2/3")
    .trim();

  const match = text.match(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*(.*)$/
  );

  if (!match) return null;

  let quantity = match[1]
    .split(/\s+/)
    .reduce((total, part) => {
      if (part.includes("/")) {
        const [a, b] = part.split("/").map(Number);
        return total + a / b;
      }

      return total + Number(part);
    }, 0);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  let unitText = match[2].trim();

  // Remove preparation descriptions
  unitText = unitText
    .replace(
      /\b(thinly|finely|roughly|freshly|chopped|sliced|minced|diced|grated|peeled|dried|crushed|large|medium|small)\b/g,
      ""
    )
    .replace(/\s+/g, " ")
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
    l: "l",
    liter: "l",
    liters: "l",
    tsp: "tsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    tbsp: "tbsp",
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
    "": "pieces",
  };

  let unit = units[unitText];

  // Convert pounds into grams
  if (["lb", "lbs", "pound", "pounds"].includes(unitText)) {
    quantity *= 453.59237;
    unit = "g";
  }

  // Convert ounces into grams
  if (["oz", "ounce", "ounces"].includes(unitText)) {
    quantity *= 28.349523;
    unit = "g";
  }

  if (!unit) return null;

  quantity = Number(quantity.toFixed(2));

  if (quantity < 0.01 || quantity > 99999999.99) {
    return null;
  }

  return { quantity, unit };
}


// SEARCH RECIPES
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";

    const response = await fetch(
      `${MEALDB}/search.php?s=${encodeURIComponent(query)}`
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
    console.error(error);

    res.status(502).json({
      error: "Failed to fetch recipes from TheMealDB",
    });
  }
});

// IMPORT RECIPE
router.post("/import/:mealId", async (req, res, next) => {
  let client;

  try {
    const mealId = req.params.mealId;

    if (!/^\d+$/.test(mealId)) {
      return res.status(400).json({
        error: "Invalid MealDB recipe ID",
      });
    }

    // Check whether recipe was already imported
    const existing = await pool.query(
      "SELECT * FROM recipes WHERE mealdb_id = $1",
      [mealId]
    );

    if (existing.rows.length) {
      return res.json({
        message: "Recipe already imported",
        recipe: existing.rows[0],
      });
    }

    // Fetch complete recipe from MealDB
    const response = await fetch(
      `${MEALDB}/lookup.php?i=${mealId}`
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

  
const measurements = req.body?.measurements || {};

const allowedUnits = [
  "g", "kg", "ml", "l",
  "tsp", "tbsp", "cup",
  "pieces", "cloves", "slices", "bulb"
];

const ingredients = getIngredients(meal).map(
  (item, index) => {
    let parsed = parseMeasure(item.measure);

    // Use reviewed measurements when needed
    if (!parsed && measurements[index]) {
      const quantity = Number(
        measurements[index].quantity
      );

      const unit = measurements[index].unit;

      if (
        Number.isFinite(quantity) &&
        quantity >= 0.01 &&
        quantity <= 99999999.99 &&
        allowedUnits.includes(unit)
      ) {
        parsed = { quantity, unit };
      }
    }

    return {
      ...item,
      index,
      parsed,
    };
  }
);


    // Do not invent quantities for ambiguous measurements
    const unsupported = ingredients.filter(
      (item) => !item.parsed
    );

    if (!ingredients.length || unsupported.length) {
      return res.status(422).json({
        error: "Some ingredients require measurement review",
        ingredients: unsupported,
      });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    // Insert recipe and prevent duplicate imports
    const result = await client.query(
      `INSERT INTO recipes
        (title, description, instructions, image_url, mealdb_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (mealdb_id) DO NOTHING
       RETURNING *`,
      [
        meal.strMeal,
        `${meal.strCategory || "Recipe"} from TheMealDB`,
        meal.strInstructions || "",
        meal.strMealThumb,
        mealId,
      ]
    );

    if (!result.rows.length) {
      const existing = await client.query(
        "SELECT * FROM recipes WHERE mealdb_id = $1",
        [mealId]
      );

      await client.query("COMMIT");

      return res.json({
        message: "Recipe already imported",
        recipe: existing.rows[0],
      });
    }

    const recipe = result.rows[0];

    // Add ingredients and link them to the recipe
    for (const ingredient of ingredients) {
     const aliases = {
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
};

const name =
  aliases[ingredient.name.trim().toLowerCase()] ||
  ingredient.name.trim();

      const found = await client.query(
        `SELECT id FROM ingredients
         WHERE LOWER(name) = LOWER($1)
         ORDER BY id LIMIT 1`,
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

      await client.query(
        `INSERT INTO recipe_ingredients
          (recipe_id, ingredient_id, quantity, unit)
         VALUES ($1, $2, $3, $4)`,
        [
          recipe.id,
          ingredientId,
          ingredient.parsed.quantity,
          ingredient.parsed.unit,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Recipe imported successfully",
      recipe,
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    next(error);
  } finally {
    if (client) client.release();
  }
});

export default router;
