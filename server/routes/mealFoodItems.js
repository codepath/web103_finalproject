import express from 'express'
import MealFoodItemsController from '../controllers/mealFoodItems.js'

const router = express.Router()

router.get('/meal/:mealId', MealFoodItemsController.getFoodItemsForMeal)
router.post('/meal/:mealId', MealFoodItemsController.addFoodItemToMeal)
router.patch('/:id', MealFoodItemsController.updateMealFoodItem)
router.delete('/:id', MealFoodItemsController.removeFoodItemFromMeal)

export default router
