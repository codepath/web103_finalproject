import express from 'express'
import UsersTripsController from '../controllers/users_trips.js'

const router = express.Router()

router.post('/create/:trip_id', UsersTripsController.createTripUser)
router.get('/users/:trip_id', UsersTripsController.getTripUsers)
router.get('/trips/:username', UsersTripsController.getUserTrips)

export default router