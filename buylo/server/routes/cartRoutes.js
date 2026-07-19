import { Router } from "express";
import { addToCart, getCartByUser } from "../controller/cartController.js";

const cartRouter = Router();

cartRouter.route("/cart/add").post(addToCart);
cartRouter.route("/cart/items").get(getCartByUser);

export default cartRouter;
