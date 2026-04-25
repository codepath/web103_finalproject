import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
} from "../controller/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = Router();


userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(authMiddleware, getAllUsers);
userRouter.route("/me").get(authMiddleware, getUserById);
userRouter.route("/:userId").get(getUserById);

export default userRouter;
