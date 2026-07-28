import express from 'express'
import { getAllMatches, getMatchById } from '../controllers/matchesController.js'

const router = express.Router()

// GET /api/matches (optionally ?date=YYYY-MM-DD)
router.get('/', getAllMatches)

// GET /api/matches/:id
router.get('/:id', getMatchById)

export default router
