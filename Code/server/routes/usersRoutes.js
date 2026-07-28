import express from 'express'
import {
    getAllUsers,
    getUserById,
    login,
    createUser,
    updateUser
} from '../controllers/usersController.js'

const router = express.Router()

// GET /api/users — fan leaderboard (all users by points)
router.get('/', getAllUsers)

// POST /api/users/login
// ⚠️ Must be defined BEFORE /:id so Express doesn't treat "login" as an id
router.post('/login', login)

// GET /api/users/:id
router.get('/:id', getUserById)

// POST /api/users — sign up
router.post('/', createUser)

// PATCH /api/users/:id — update profile
router.patch('/:id', updateUser)

export default router
