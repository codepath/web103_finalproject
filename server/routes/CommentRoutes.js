import express from 'express';
import { getAllComments, createComment } from '../controllers/CommentController.js';

const router = express.Router();

router.get('/', getAllComments);
router.post('/', createComment);
// Uncomment and implement these in CommentController.js if needed
// router.patch('/:id', updateComment);
// router.delete('/:id', deleteComment);

export default router;
