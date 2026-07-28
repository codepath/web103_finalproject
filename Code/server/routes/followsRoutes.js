import express from 'express'
import { getFollowsByUser, createFollow, deleteFollow } from '../controllers/followsController.js'

const router = express.Router()

// GET /api/follows/user/:userId
router.get('/user/:userId', getFollowsByUser)

// POST /api/follows
router.post('/', createFollow)

// DELETE /api/follows/:id
router.delete('/:id', deleteFollow)

export default router
