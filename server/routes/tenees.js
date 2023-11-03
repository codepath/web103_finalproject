import TeneesController from '../controllers/tenees.js';
import express from 'express';

const router = express.Router();

router.post('/', TeneesController.createTeneesProfile);
router.patch('/:id', TeneesController.updateTeneesProfile);
router.delete('/:id', TeneesController.deleteTeneesProfile);

router.get('/:id', TeneesController.getTeneesProfileById);
router.get('/', TeneesController.getAllTeneesProfile);
router.get('/user/:userId', TeneesController.getTeneesProfileByUserId);


export default router;