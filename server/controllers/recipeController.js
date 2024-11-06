import { pool } from '../config/database.js';
import { fetchRecipesFromSpoonacular, fetchRecipeByIdFromSpoonacular } from '../utils/spoonacularService.js';

// Fetch recipe suggestions from Spoonacular based on user ingredients
const fetchSuggestedRecipes = async (req, res) => {
    const { ingredients, preferences } = req.body; // Ingredients and preferences from frontend

    try {
        const recipes = await fetchRecipesFromSpoonacular(ingredients, preferences);
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes from Spoonacular:', error);
        res.status(500).json({ message: 'Error fetching recipes from Spoonacular' });
    }
};

// Get recipe by ID from the database or Spoonacular
const fetchRecipeById = async (req, res) => {
    const recipeId = req.params.id;

    try {
        let recipe = await pool.query(
            `SELECT * FROM recipes WHERE spoonacular_recipe_id = $1`,
            [recipeId]
        );
        recipe = recipe.rows;

        // Step 2: If recipe is not found, fetch from Spoonacular and store in DB
        if (recipe.length === 0) {

            recipe = await fetchRecipeByIdFromSpoonacular(recipeId);
            recipe = [{
                spooncularRecipeId: recipe.id,
                title: recipe.title,
                summary: recipe.summary,
                image: recipe.image,
                servings: recipe.servings,
                instructions: recipe.instructions,
                readyInMinutes: recipe.readyInMinutes,
                ingredients: recipe.extendedIngredients.map((ingredient) => ({
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                }))
            }]
        }

        res.status(200).json(recipe[0]);
    }

    catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ message: 'Error fetching recipe by ID' });
    }
};

// Save a recipe to the user's favorites
const saveRecipe = async (req, res) => {
    const { recipeId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the recipe already exists in the database
        let recipeResult = await pool.query(
            `SELECT * FROM recipes WHERE spoonacular_recipe_id = $1`,
            [recipeId]
        );

        // If the recipe is not found in the database, fetch from Spoonacular and insert it
        if (recipeResult.rows.length === 0) {
            const recipe = await fetchRecipeByIdFromSpoonacular(recipeId);

            // Insert the recipe into the recipes table
            const recipeInsertResult = await pool.query(
                `INSERT INTO recipes (spoonacular_recipe_id, title, summary, image_url, servings, instructions, ready_in_minutes) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [
                    recipe.id,
                    recipe.title,
                    recipe.summary,
                    recipe.image,
                    recipe.servings,
                    recipe.instructions,
                    recipe.readyInMinutes,
                ]
            );

            const dbRecipeId = recipeInsertResult.rows[0].id;

            // Insert each ingredient associated with the recipe
            const ingredientPromises = recipe.extendedIngredients.map((ingredient) =>
                pool.query(
                    `INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES ($1, $2, $3, $4)`,
                    [dbRecipeId, ingredient.name, ingredient.amount, ingredient.unit]
                )
            );
            await Promise.all(ingredientPromises);

            recipeResult = await pool.query(`SELECT * FROM recipes WHERE id = $1`, [dbRecipeId]);
        }

        const dbRecipeId = recipeResult.rows[0].id;

        // Check if the recipe is already in the user's favorites
        const favoriteCheck = await pool.query(
            `SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2`,
            [userId, dbRecipeId]
        );

        if (favoriteCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Recipe is already in favorites' });
        }

        // Insert into favorites table
        await pool.query(
            `INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)`,
            [userId, dbRecipeId]
        );

        res.status(201).json({ message: 'Recipe saved as favorite successfully' });
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ message: 'Error saving recipe' });
    }
};

// Fetch all saved recipes for the authenticated user
const getSavedRecipes = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT recipes.* FROM recipes
            JOIN favorites ON recipes.id = favorites.recipe_id
            WHERE favorites.user_id = $1`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ message: 'Error fetching saved recipes' });
    }
};

// Remove a recipe from the user's favorites
const deleteFavoriteRecipe = async (req, res) => {
    const { recipeId } = req.params; // The ID of the recipe to remove
    const userId = req.user.id; // Assuming the user ID is stored in req.user after authentication

    try {
        const result = await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2 RETURNING *',
            [userId, recipeId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Recipe not found in favorites' });
        }

        res.json({ message: 'Recipe removed from favorites' });
    } catch (error) {
        console.error('Error removing recipe:', error);
        res.status(500).json({ message: 'Error removing recipe' });
    }
};

export default {
    fetchSuggestedRecipes,
    fetchRecipeById,
    saveRecipe,
    getSavedRecipes,
    deleteFavoriteRecipe
};
