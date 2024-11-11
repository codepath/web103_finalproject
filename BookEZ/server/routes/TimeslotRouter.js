import express from 'express';
import TimeslotController from '../controllers/TimeslotController.js';

const router = express.Router();

router.get('/free/:employee_id', TimeslotController.getFreeTimeslotsByEmployeeId);
router.post('/book/:timeslot_id', TimeslotController.bookTimeslotByTimeslotId);

export default router;