import express from 'express'
// import controller from '../controllers/controller.js'
import controller from '../controllers/recipeController.js'

const router = express.Router()

router.post("/create/recipe", controller.createRecipe)
router.get("/recipes", controller.getRecipes)
router.get("/recipe/:id", controller.getRecipe)
router.get("/recipe/:id/ingredients", controller.getRecipeIngredients)
router.patch("/patch/recipe/:id", controller.updateRecipe)
router.delete("/delete/recipe/:id", controller.deleteRecipe)

export default router
