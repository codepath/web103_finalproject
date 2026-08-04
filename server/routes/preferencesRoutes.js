import controller from '../controllers/preferenceController.js'
import express from 'express'

const routes = express.Router()

routes.post('/create/preference', controller.createPreference)
routes.get('/preferences', controller.getPreferences)
routes.get('/preference/:id', controller.getPreference)
routes.delete('/delete/preference/:id', controller.deletePreference)

export default routes
