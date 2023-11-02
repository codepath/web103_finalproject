import express from 'express';
import { getAllResources, createResource } from '../controllers/ResourceController.js';

const router = express.Router();

router.get('/', getAllResources);
router.post('/', createResource);
// Uncomment and implement these in ResourceController.js if needed
// router.patch('/:id', updateResource);
// router.delete('/:id', deleteResource);

export default router;
