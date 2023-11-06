import express from 'express';
import { getAllPosts, createPost,updatePost,deletePost } from '../controllers/PostController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.put('/:id', updatePost);

// Uncomment and implement these in PostController.js if needed

router.delete('/:id', deletePost);

export default router;
