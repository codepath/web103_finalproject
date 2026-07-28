import express from 'express'
import { getPredictionsByUser, createPrediction } from '../controllers/predictionsController.js'

const router = express.Router()

// GET /api/predictions/user/:userId
router.get('/user/:userId', getPredictionsByUser)

// POST /api/predictions
router.post('/', createPrediction)

export default router
