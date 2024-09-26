import express from "express";
import ProfileController from "../controllers/profile.js";

const router = express.Router();

router.put("/profile", ProfileController.updateUserProfile);
router.patch("/new-profile-photo", ProfileController.updateUserProfilePhoto);

export default router;
