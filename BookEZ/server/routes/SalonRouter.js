import express from 'express'
import SalonController from '../controllers/SalonController.js'

const router = express.Router()

router.get('/', SalonController.getAllSalons)
router.get('/:salon_id', SalonController.getSalonById)

export default router;
