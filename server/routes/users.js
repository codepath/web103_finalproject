import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/users.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getCurrentUser);

export default router;