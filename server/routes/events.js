import express from 'express'
import CommentsController from '../controllers/comments.js'
import EventsController from '../controllers/events.js'
import RsvpsController from '../controllers/rsvps.js'
import { requireHost, requireOrganizer, requireUser } from '../utils/access.js'

// Create a new router instance
const router = express.Router()

// only the organizer of the event's group may change or delete the event, or see who answered
const requireEventOrganizer = requireOrganizer(EventsController.getEventOrganizerId)

// Define a route to get all events
router.get('/', EventsController.getEvents)

// Define a route for a host to create an event
router.post('/', requireHost, EventsController.createEvent)

// Define a route to get the small records the map needs (this comes before the ID route so "pins" is not read as an ID)
router.get('/pins', EventsController.getEventPins)

// Define a route to get the answers a person can give to an event (also before the ID route)
router.get('/rsvp-statuses', RsvpsController.getRsvpStatuses)

// Define a route to get a specific event by its ID
router.get('/:eventId', EventsController.getEventById)

// Define routes for the organizer to edit or delete their event
router.patch('/:eventId', requireEventOrganizer, EventsController.updateEvent)
router.delete('/:eventId', requireEventOrganizer, EventsController.deleteEvent)

// Define a route for the organizer to see who answered for their event
router.get('/:eventId/rsvps', requireEventOrganizer, RsvpsController.getEventRsvps)

// Define routes for a logged-in person to say they are going, change their answer, or take it back
router.post('/:eventId/rsvps', requireUser, RsvpsController.createRsvp)
router.patch('/:eventId/rsvps/me', requireUser, RsvpsController.updateRsvp)
router.delete('/:eventId/rsvps/me', requireUser, RsvpsController.deleteRsvp)

// Comments: public read, logged-in users post; likes require login
router.get('/:eventId/comments', CommentsController.getComments)
router.post('/:eventId/comments', requireUser, CommentsController.createComment)
router.post('/:eventId/comments/:commentId/likes', requireUser, CommentsController.likeComment)
router.delete('/:eventId/comments/:commentId/likes', requireUser, CommentsController.unlikeComment)

export default router
