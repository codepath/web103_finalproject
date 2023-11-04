import express from 'express'

import CommentsController from '../controllers/comments.js'

const router = express.Router()

router.get('/', CommentsController.getComments)
router.get('/:sneaker_id', CommentsController.getSneakerComments)
router.post('/:sneaker_id', CommentsController.createComment)
router.delete('/:id', CommentsController.deleteComment)
router.patch('/:id', CommentsController.updateSneakerLikes)

export default router

