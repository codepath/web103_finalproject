import express from 'express'
import controller from '../controllers/favoritesController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const routes = express.Router()

routes.get(`/favorites`, requireAuth, controller.getFavorites)
routes.get(`/favorite/:id`, requireAuth, controller.getFavorite)
// routes.patch(`/favorite/:id`, controller.updateFavorite)
routes.post(`/create/favorite`, requireAuth, controller.createFavorite)
routes.delete(`/delete/favorite/:id`, requireAuth, controller.deleteFavorite)

export default routes
