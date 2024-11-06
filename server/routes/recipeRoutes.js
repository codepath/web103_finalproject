import express from 'express';
import recipeController from '../controllers/recipeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/recipes/suggestions:
 *   post:
 *     summary: Fetch recipe suggestions based on user ingredients
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched recipes
 *       500:
 *         description: Error fetching recipes from Spoonacular
 */
router.post('/suggestions', authMiddleware, recipeController.fetchSuggestedRecipes);

/**
 * @swagger
 * /api/recipes/saved:
 *   get:
 *     summary: Get all saved recipes for the authenticated user
 *     tags: [Recipes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved saved recipes
 *       500:
 *         description: Error fetching saved recipes
 */
router.get('/saved', authMiddleware, recipeController.getSavedRecipes);

/**
 * @swagger
 * /api/recipes/save:
 *   post:
 *     summary: Save a recipe to the user's favorites
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Recipe saved as favorite successfully
 *       400:
 *         description: Recipe is already in favorites
 *       500:
 *         description: Error saving recipe
 */
router.post('/save', authMiddleware, recipeController.saveRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a recipe by its ID
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recipe
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Error fetching recipe by ID
 */
router.get('/:id', authMiddleware, recipeController.fetchRecipeById);

/**
 * @swagger
 * /api/recipes/delete/{recipeId}:
 *   delete:
 *     summary: Remove a recipe from the user's favorites
 *     tags: [Recipes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recipe to remove
 *     responses:
 *       200:
 *         description: Recipe removed from favorites
 *       404:
 *         description: Recipe not found in favorites
 *       500:
 *         description: Error removing recipe
 */
router.delete('/deleteSaved/:recipeId', authMiddleware, recipeController.deleteFavoriteRecipe);

export default router;
