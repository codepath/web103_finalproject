import UserControllers from '../controllers/user.js';
import express from 'express';

const router = express.Router();

router.post('/register', UserControllers.registerUser);
router.post('/login', UserControllers.loginUser);

export default router;