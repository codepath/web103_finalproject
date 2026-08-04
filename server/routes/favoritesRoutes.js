import express from 'express'
import controller from '../controllers/favoritesController.js'

const routes = express.Router()

routes.get(`/favorites`, controller.getFavorites)
routes.get(`/favorite/:id`, controller.getFavorite)
// routes.patch(`/favorite/:id`, controller.updateFavorite)
routes.post(`/create/favorite`, controller.createFavorite)
routes.delete(`/delete/favorite/:id`, controller.deleteFavorite)

export default routes
