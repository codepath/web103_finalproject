import express from 'express'
import TripsController from '../controllers/trips.js'

const router = express.Router()

router.get('/trips', TripsController.getTrips)
router.get('/:id', TripsController.getTrip)
router.post('/trips', TripsController.createTrip)
router.delete('/:id', TripsController.deleteTrip)
router.patch('/:id', TripsController.updateTrip)

export default router