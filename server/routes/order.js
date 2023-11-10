import express from "express";
import { createOrderFromCart } from "../controllers/order";
const router = express.Router();
router.post("/createOrder", createOrderFromCart);

export default router;
