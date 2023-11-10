import express from "express";
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from "../controllers/cart.js";

const router = express.Router();

router.post("/add-to-cart", addToCart);
router.get("/get-cart", getCart);
router.put("/update-cart-item/:itemId", updateCartItemQuantity);
router.delete("/remove-from-cart/:itemId", removeFromCart);

export default router;
