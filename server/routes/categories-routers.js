import express from 'express'
import categoriesControllers from '../controllers/categories-controllers.js'

const router = express.Router()

router.get('/', categoriesControllers.getCategories)
router.get('/:categoryId', categoriesControllers.getCategoryById)

export default router