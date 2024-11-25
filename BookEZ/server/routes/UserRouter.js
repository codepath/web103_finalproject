import express from 'express'
import UserController from '../controllers/UserController.js'

const router = express.Router()

router.get('/:user_id', UserController.getUserDetailsByUserId)
router.put('/:user_id', UserController.updateUserDetailsByUserId)

export default router
