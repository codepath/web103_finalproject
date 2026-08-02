import express from 'express'
import controller from '../controllers/recipeController.js'
import { requireAdmin } from '../middleware/requireAuth.js'

const router = express.Router()

router.post("/create/recipe", requireAdmin, controller.createRecipe)
router.get("/recipes", controller.getRecipes)
router.get("/recipe/:id", controller.getRecipe)
router.patch("/patch/recipe/:id", requireAdmin, controller.updateRecipe)
router.delete("/delete/recipe/:id", requireAdmin, controller.deleteRecipe)

export default router
