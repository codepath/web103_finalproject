import { Router } from "express";

import {
  listShopping,
  addShoppingItem,
  addMissingFromRecipe,
  generateShoppingList,
  updateShoppingItem,
  deleteShoppingItem,
  clearChecked,
  moveCheckedToPantry
} from "../controllers/shoppingController.js";

const router = Router();

router.get("/", listShopping);
router.post("/", addShoppingItem);
router.post("/from-recipe/:recipeId", addMissingFromRecipe);
router.post("/checked/to-pantry", moveCheckedToPantry);
router.delete("/checked", clearChecked);
router.patch("/:id", updateShoppingItem);
router.delete("/:id", deleteShoppingItem);
router.post("/generate", generateShoppingList);

export default router;
