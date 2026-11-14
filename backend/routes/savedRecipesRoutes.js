import { Router } from 'express';
import { listSavedRecipes, saveRecipe, unsaveRecipe } from '../controllers/savedRecipesController.js';

const router = Router();

router.get("/", listSavedRecipes);
router.post("/", saveRecipe);
router.delete("/:recipeId", unsaveRecipe);

export default router;