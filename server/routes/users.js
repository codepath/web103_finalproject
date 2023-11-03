import UsersController from '../controllers/users.js';
import express from 'express';

const router = express.Router();

router.post('/', UsersController.createUser);
router.patch('/:id', UsersController.updateUser);

router.get('/:id', UsersController.getUserById);

export default router;