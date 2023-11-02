import express from 'express';
import { getAllPosts, createPost } from '../controllers/PostController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', createPost);
// Uncomment and implement these in PostController.js if needed
// router.patch('/:id', updatePost);
// router.delete('/:id', deletePost);

export default router;
