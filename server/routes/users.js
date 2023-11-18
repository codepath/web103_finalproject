import express from "express";

import UsersController from "../controllers/users.js";

const router = express.Router();

router.get("/:id", UsersController.getUserById);

export default router;
