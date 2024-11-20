import express from 'express'
import { register, login } from '../controllers/AuthController.js'
import { authenticateToken } from '../middleware/AuthMiddleware.js'

const router = express.Router()

// Test route if user is authenticated
function authenticate(req, res) {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  res.json({ message: `Welcome, user ${req.user.userId}` })
}

router.post('/register', register)
router.post('/login', login)
router.get('/protected', authenticateToken, authenticate)

export default router
