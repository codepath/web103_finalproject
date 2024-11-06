import express from 'express';
import userRoutes from '../routes/userRoutes.js';
import recipeRoutes from '../routes/recipeRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import getDiets from '../routes/dietRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes); // Authentication routes
router.use('/users', userRoutes); // User routes
router.use('/recipes', recipeRoutes); // Recipe routes
router.use('/diets', getDiets); // Diet routes

export default router;