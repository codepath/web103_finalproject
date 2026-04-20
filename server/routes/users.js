import express from 'express'
import UsersController from '../controllers/users.js'

const router = express.Router()

router.get('/', UsersController.getUsers)
router.get('/:id', UsersController.getUser)
router.post('/', UsersController.createUser)
router.patch('/:id', UsersController.updateUser)
router.delete('/:id', UsersController.deleteUser)

export default router
