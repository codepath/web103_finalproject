import express from 'express'
import MealsController from '../controllers/meals.js'

const router = express.Router()

router.get('/', MealsController.getMeals)
router.get('/user/:userId', MealsController.getMealsByUser)
router.get('/:id', MealsController.getMeal)
router.post('/', MealsController.createMeal)
router.patch('/:id', MealsController.updateMeal)
router.delete('/:id', MealsController.deleteMeal)

export default router
