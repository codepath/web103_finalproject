import fs from "fs/promises";
import path from "path";
import slugify from "slugify";
import { GoogleGenAI, Modality } from "@google/genai";
import { pool } from "../config/db.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "v1beta"
  }
});


async function getRecipeById(recipeId) {
  const { rows } = await pool.query(
    `
    SELECT
      r.id,
      r.title,
      r.description,
      r.meal_type,
      r.dietary_preference,
      r.prep_minutes,
      r.servings,
      r.image_url,
      COALESCE(
        string_agg(
          i.name || ' (' || ri.quantity || ' ' || ri.unit || ')',
          ', ' ORDER BY i.name
        ),
        ''
      ) AS ingredients
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    LEFT JOIN ingredients i ON i.id = ri.ingredient_id
    WHERE r.id = $1
    GROUP BY r.id
    `,
    [recipeId]
  );

  return rows[0];
}


function buildPrompt(recipe) {
  return `
Generate a realistic food photo of this meal.

Recipe title: ${recipe.title}
Description: ${recipe.description || ""}
Meal type: ${recipe.meal_type || ""}
model: "gemini-3.1-flash-image",
Servings: ${recipe.servings || ""}
Ingredients: ${recipe.ingredients || ""}

Style requirements:
- realistic food photography
- appetizing
- clean plate or bowl
- natural lighting
- modern food styling
- high quality
- no text
- no watermark
- simple background
`;
}

async function saveImage(base64Data, recipe) {
  const uploadsDir = path.join(process.cwd(), "uploads", "recipes");
  await fs.mkdir(uploadsDir, { recursive: true });

  const safeTitle = slugify(recipe.title, { lower: true, strict: true });
  const filename = `${safeTitle}-${recipe.id}.png`;
  const filePath = path.join(uploadsDir, filename);

  await fs.writeFile(filePath, Buffer.from(base64Data, "base64"));

  return `/uploads/recipes/${filename}`;
}

export async function generateRecipeImage(req, res, next) {
  try {
    const recipeId = req.params.id;
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    const prompt = buildPrompt(recipe);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let imageBase64 = null;

    const parts = response?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: "No image returned from Gemini." });
    }

    const imageUrl = await saveImage(imageBase64, recipe);

    await pool.query(
      "UPDATE recipes SET image_url = $1 WHERE id = $2",
      [imageUrl, recipe.id]
    );

    res.json({
      message: "Recipe image generated successfully.",
      recipe_id: recipe.id,
      image_url: imageUrl,
    });
  } catch (e) {
    next(e);
  }
}

export async function generateAllRecipeImages(_req, res, next) {
  try {
    const { rows: recipes } = await pool.query(
      "SELECT id FROM recipes ORDER BY id"
    );

    let generated = 0;

    for (const row of recipes) {
      const recipe = await getRecipeById(row.id);
      const prompt = buildPrompt(recipe);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      let imageBase64 = null;
      const parts = response?.candidates?.[0]?.content?.parts || [];

      for (const part of parts) {
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
          break;
        }
      }

      if (!imageBase64) continue;

      const imageUrl = await saveImage(imageBase64, recipe);

      await pool.query(
        "UPDATE recipes SET image_url = $1 WHERE id = $2",
        [imageUrl, recipe.id]
      );

      generated++;
    }

    res.json({
      message: "Finished generating recipe images.",
      generated,
    });
  } catch (e) {
    next(e);
  }
}