import express from 'express'
import controller from '../controllers/scheduledMealsController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/scheduled-meals', requireAuth, controller.getScheduledMeals)
router.post('/create/scheduled-meal', requireAuth, controller.createScheduledMeal)
router.delete('/delete/scheduled-meal/:id', requireAuth, controller.deleteScheduledMeal)

export default router
