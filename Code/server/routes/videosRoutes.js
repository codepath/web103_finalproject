import express from 'express'
import { getVideosByMatch, createVideo } from '../controllers/videosController.js'

const router = express.Router()

// GET /api/videos/match/:matchId
router.get('/match/:matchId', getVideosByMatch)

// POST /api/videos
router.post('/', createVideo)

export default router
