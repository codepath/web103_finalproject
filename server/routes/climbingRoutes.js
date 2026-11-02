import express from 'express';
import ClimbingRoutesController from '../controllers/climbingRoutes.js';

const router = express.Router();

router.post('/reset', ClimbingRoutesController.resetRoutes);

router.get('/', ClimbingRoutesController.getRoutes);
router.get('/:id', ClimbingRoutesController.getRouteById);
router.post('/', ClimbingRoutesController.createRoute);
router.put('/:id', ClimbingRoutesController.updateRoute);
router.delete('/:id', ClimbingRoutesController.deleteRoute);

export default router;
