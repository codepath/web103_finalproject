import express from 'express';
import WallTypesController from '../controllers/wallTypes.js';

const router = express.Router();

router.get('/', WallTypesController.getWallTypes);

export default router;
