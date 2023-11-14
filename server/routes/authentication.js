import express from "express";
import AuthenticationController from "../controllers/authentication.js";

const router = express.Router();

router.post("/register", AuthenticationController.registerUser);
router.post("/login", AuthenticationController.loginUser);
router.post("/checkUser", AuthenticationController.userEmailExists);

export default router;
