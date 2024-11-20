import CategoryController from '../controllers/category.js';
import express from 'express';

const router = express.Router();

router.get('/', CategoryController.getCategories);

export default router;