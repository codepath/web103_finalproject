import { Router } from "express";
import {
  deleteActivity,
  getActivity,
  loadActivity,
  updateActivity,
} from "../controllers/activities.js";

const router = Router();

router.get("/:activityId", loadActivity, getActivity);
router.patch("/:activityId", loadActivity, updateActivity);
router.delete("/:activityId", loadActivity, deleteActivity);

export default router;
