import { Router } from "express";
import { listRecipes, getRecipe } from "../controllers/recipeController.js";

const router = Router();

router.get("/", listRecipes);
router.get("/:id", getRecipe);

export default router;