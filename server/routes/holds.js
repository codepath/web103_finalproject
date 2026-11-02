import express from 'express';
import HoldsController from '../controllers/holds.js';

const router = express.Router();

router.get('/', HoldsController.getHolds);

export default router;
