import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

// Native auth routes
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// OAuth routes
router.get('/github/login', authController.githubLogin)
router.get('/github/callback', authController.githubCallback)

// Token management routes
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)


export default router