import express from 'express'
import SneakersController from '../controllers/sneakers.js'

const router = express.Router()

router.get('/', SneakersController.getSneakers)
router.get('/:id', SneakersController.getSneaker)
router.post('/', SneakersController.createSneaker)
router.patch('/:id', SneakersController.updateSneaker)

export default router