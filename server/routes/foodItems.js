import express from 'express'
import FoodItemsController from '../controllers/foodItems.js'

const router = express.Router()

router.get('/', FoodItemsController.getFoodItems)
router.get('/:id', FoodItemsController.getFoodItem)
router.post('/', FoodItemsController.createFoodItem)
router.patch('/:id', FoodItemsController.updateFoodItem)
router.delete('/:id', FoodItemsController.deleteFoodItem)

export default router
