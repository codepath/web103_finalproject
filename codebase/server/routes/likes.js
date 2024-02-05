import express from 'express';
import LikesController from '../controllers/likes.js';
const router = express.Router();

router.get('/:user_id', LikesController.getLikedItemsByUser);
router.post('/:user_id/:item_id', LikesController.addLike);
router.delete('/:user_id/:item_id', LikesController.deleteLike);
// router.post('/', LikesController.createLike);
// router.delete('/:userId/:itemId', LikesController.deleteLike);

export default router;