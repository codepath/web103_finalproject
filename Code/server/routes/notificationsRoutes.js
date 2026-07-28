import express from 'express'
import { getNotificationsByUser, markNotificationRead } from '../controllers/notificationsController.js'

const router = express.Router()

// GET /api/notifications/user/:userId
router.get('/user/:userId', getNotificationsByUser)

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markNotificationRead)

export default router
