import express from 'express'
import controller from '../controllers/kitchenController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/kitchen', requireAuth, controller.getKitchen)
router.post('/create/kitchen-item', requireAuth, controller.addToKitchen)
router.delete('/delete/kitchen-item/:ingredientId', requireAuth, controller.removeFromKitchen)

export default router
