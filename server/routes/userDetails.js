import express from 'express'
import UserDetailsController from '../controllers/userDetails.js'

const router = express.Router()

router.get('/boards/:user_id', UserDetailsController.getBoardsByUserId)
router.get('/tasks/:user_id', UserDetailsController.getTasksByUserId)

export default router