import FavoritesLeasesController from '../controllers/favorites_leases.js';
import express from 'express';

const router = express.Router();

router.post('/', FavoritesLeasesController.addFavoriteLease);
router.delete('/:id', FavoritesLeasesController.deleteFavoriteLease);
router.get('/:userId', FavoritesLeasesController.getAllFavoriteLeasesByUser);

export default router;