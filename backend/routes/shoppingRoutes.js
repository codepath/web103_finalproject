import { Router } from "express";
import {
  listShopping, addShoppingItem, addMissingFromRecipe,
  updateShoppingItem, deleteShoppingItem, clearChecked,
} from "../controllers/shoppingController.js";

const router = Router();

router.get("/", listShopping);
router.post("/", addShoppingItem);
router.post("/from-recipe/:recipeId", addMissingFromRecipe);
router.delete("/checked", clearChecked);
router.patch("/:id", updateShoppingItem);
router.delete("/:id", deleteShoppingItem);

export default router;
