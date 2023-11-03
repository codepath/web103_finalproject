import FavoritesTeneesController from "../controllers/favorites_tenees.js";
import express from "express";

const router = express.Router();

router.post("/", FavoritesTeneesController.addFavoriteTenee);
router.delete("/:id", FavoritesTeneesController.deleteFavoriteTenee);
router.get("/:userId", FavoritesTeneesController.getAllFavoriteTeneesByUser);

export default router;
