import express from "express";
import orderController from "../controllers/order.js";
const router = express.Router();
router.get("/getOrders", orderController.getOrders);
router.post("/createOrder", orderController.createOrderFromCart);
export default router;
