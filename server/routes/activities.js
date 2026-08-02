// Mounted at /api/activities — get a single activity, or edit/delete it by its own id.
import { Router } from "express";
import {
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../controllers/activities.js";

const router = Router();

router.get("/:id", getActivityById);
router.patch("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
