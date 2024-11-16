import express from 'express';
import TimeslotController from '../controllers/TimeslotController.js';

const router = express.Router();

router.get('/free/:employee_id', TimeslotController.getFreeTimeslotsByEmployeeId);
router.post('/book/:timeslot_id', TimeslotController.bookTimeslotByTimeslotId);
router.post('/cancel/:timeslot_id', TimeslotController.cancelTimeslotById);
router.get('/:timeslot_id', TimeslotController.getATimeslotById);

export default router;