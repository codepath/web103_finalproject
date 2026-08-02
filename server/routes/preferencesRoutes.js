import controller from '../controllers/preferenceController.js'
import express from 'express'
import { requireAuth } from '../middleware/requireAuth.js'

const routes = express.Router()

routes.post('/create/preference', requireAuth, controller.createPreference)
routes.get('/preferences', requireAuth, controller.getPreferences)
routes.get('/preference/:id', requireAuth, controller.getPreference)
routes.delete('/delete/preference/:id', requireAuth, controller.deletePreference)

export default routes
