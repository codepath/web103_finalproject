import express from 'express'
import clubsControllers from '../controllers/clubs-controllers.js'

const router = express.Router()

router.get('/', clubsControllers.getClubs)
router.get('/:clubId', clubsControllers.getClubById)

export default router