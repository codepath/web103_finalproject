import express from "express";
import {
  generateRecipeImage,
  generateAllRecipeImages,
} from "../controllers/recipeImageController.js";

const router = express.Router();

router.post("/recipes/:id/generate-image", generateRecipeImage);
router.post("/recipes/generate-images", generateAllRecipeImages);

export default router;