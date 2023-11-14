import express from "express";
import UserDetailsController from "../controllers/userDetails.js";

const router = express.Router();

router.get("/user", UserDetailsController.getAllUsers);
router.get("/user/:user_id", UserDetailsController.getUserByUserId);
router.get("/user/boards/:user_id", UserDetailsController.getBoardsByUserId);
router.get("/user/tasks/:user_id", UserDetailsController.getTasksByUserId);
router.post("/user", UserDetailsController.createUserProfile);

export default router;
