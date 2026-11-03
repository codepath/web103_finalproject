import express from "express";
import userControllers from "../controllers/userControllers.js";

const router = express.Router();

router.post("/", userControllers.createUserAndReadingList);

export default router;