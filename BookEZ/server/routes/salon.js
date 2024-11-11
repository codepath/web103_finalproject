import express from 'express'
import SalonController from '../controllers/salon.js'

const router = express.Router()

router.get('/', SalonController.getAllSalons)
router.get('/:salon_id', SalonController.getSalonById)

export default router;
