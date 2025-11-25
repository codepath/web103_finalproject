import express from "express";
import {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
  getFriends,
} from "../controllers/user.js";

const router = express.Router();

// More specific routes first
router.get("/username/:username", getUserByUsername);
router.post("/friends/add", addFriend);
router.post("/friends/remove", removeFriend);
router.get("/:id/friends", getFriends);

// General routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
