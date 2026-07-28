import express from 'express'
import { getAllTeams, getTeamById } from '../controllers/teamsController.js'

const router = express.Router()

// GET /api/teams (optionally ?search=liverpool)
router.get('/', getAllTeams)

// GET /api/teams/:id
router.get('/:id', getTeamById)

export default router
