import express from 'express'
import ItemsController from '../controllers/items.js'
const router = express.Router()

router.get('/filter', ItemsController.filterItems);
router.get('/:id', ItemsController.getItem)
router.patch('/:id', ItemsController.updateItem)
router.delete('/:id', ItemsController.deleteItem)
router.get('/', ItemsController.getItems)
router.post('/', ItemsController.createItem)

export default router