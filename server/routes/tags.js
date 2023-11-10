import express from 'express'
import TagsController from '../controllers/tags.js'

const router = express.Router()

router.get('/', TagsController.getTags)
router.get('/:id', TagsController.getTag)
router.post('/', TagsController.createTag)
router.delete('/:id', TagsController.deleteTag)
router.patch('/:id', TagsController.updateTag)

export default router