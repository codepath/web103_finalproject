import express from 'express'
import eventsControllers from '../controllers/events-controllers.js'

const router = express.Router()

router.get('/', eventsControllers.getEvents)
router.get('/:eventId', eventsControllers.getEventById)

export default router