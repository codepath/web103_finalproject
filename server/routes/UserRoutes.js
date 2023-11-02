import express from 'express';
import { getAllUsers, createUser } from '../controllers/UserController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
// Uncomment and implement these in UserController.js if needed
// router.patch('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;
