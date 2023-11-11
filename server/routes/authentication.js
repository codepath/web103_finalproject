import express from 'express'
import AuthenticationController from '../controllers/authentication.js'

const router = express.Router()

router.post('/login/username', AuthenticationController.userNameExists)
router.post('/login/password', AuthenticationController.passwordAccuracy)

export default router