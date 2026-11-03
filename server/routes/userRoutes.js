import express from "express";
import userControllers from "../controllers/userControllers";

const router = express.Router();

router.post("/", userControllers.createUser);