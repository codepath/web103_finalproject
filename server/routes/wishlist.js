import express from 'express'
import WishlistController from '../controllers/wishlist.js'

const router = express.Router()

router.get('/', WishlistController.getWishlistMovies)
router.get('/:id', WishlistController.getWishlistMovie)
router.post('/', WishlistController.createWishlistMovie)
router.delete('/:id', WishlistController.deleteWishlistMovie)

// no need to update movies in wishlist



export default router
