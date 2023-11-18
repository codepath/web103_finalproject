import express from 'express';
import { getAllTypes, createType } from '../controllers/TypeController.js';

const router = express.Router();

router.get('/', getAllTypes);
router.post('/', createType);
// Uncomment and implement these in TypeController.js if needed
// router.patch('/:id', updateType);
// router.delete('/:id', deleteType);

export default router;
