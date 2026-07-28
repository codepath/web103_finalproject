import express from 'express'
import { getAllPlayers, getPlayerById } from '../controllers/playersController.js'

const router = express.Router()

// GET /api/players (optionally ?search=salah or ?sort=goals)
router.get('/', getAllPlayers)

// GET /api/players/:id
router.get('/:id', getPlayerById)

export default router
