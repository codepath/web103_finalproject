import express from 'express';
import { getAllPosts, createPost, getPostById, updatePost, deletePost } from '../controllers/PostController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
