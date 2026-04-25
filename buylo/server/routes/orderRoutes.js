import { Router } from "express";
import {
  addShippingAddress,
  createNewOrder,
  getAllOrders,
  getOrdersByUserId,
} from "../controller/orderController.js";
import authMiddleware from "../middleware/auth.js";
import isManager from "../middleware/isManager.js";

const orderRouter = Router();

orderRouter.route("/shipping").patch(authMiddleware, addShippingAddress);
orderRouter.route("/checkout").post(authMiddleware, createNewOrder);
orderRouter.route("/:userId").get(authMiddleware, getOrdersByUserId);

//Admin Orders routes
orderRouter.route("/admin").get(authMiddleware, isManager, getAllOrders);

export default orderRouter;
