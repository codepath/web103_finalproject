import express from 'express'
import UsersController from '../controllers/users.js'
const router = express.Router()

router.get('/', UsersController.getUsers) 
router.get('/:id', UsersController.getUser)
router.post('/', UsersController.createUser)
router.delete('/:id', UsersController.deleteUser)
router.patch('/:id', UsersController.updateUser)
// router.get('/filter', ItemsController.filterItems); //use these example routes in the future


export default router