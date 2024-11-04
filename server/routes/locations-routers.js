import express from 'express'
import locationsControllers from '../controllers/locations-controllers.js'

const router = express.Router()

router.get('/', locationsControllers.getLocations)
router.get('/:locationId', locationsControllers.getLocationById)

export default router