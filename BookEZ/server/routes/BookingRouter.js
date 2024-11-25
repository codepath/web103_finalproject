import express from 'express';
import BookingController from '../controllers/BookingController.js';

const router = express.Router();

router.get('/user/:user_id', BookingController.getBookingsByUserId);
router.post('/', BookingController.addBooking);
router.delete('/:booking_id', BookingController.deleteBookingByBookingId);

export default router;