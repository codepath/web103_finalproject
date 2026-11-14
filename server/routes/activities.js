import { Router } from "express";
import {
  deleteActivity,
  getActivity,
  loadActivity,
  updateActivity,
} from "../controllers/activities.js";

import { addVote, removeVote } from "../controllers/votes.js";

const router = Router();

router.get("/:activityId", loadActivity, getActivity);
router.patch("/:activityId", loadActivity, updateActivity);
router.delete("/:activityId", loadActivity, deleteActivity);
router.post("/:activityId/votes", loadActivity, addVote);
router.delete("/:activityId/votes", loadActivity, removeVote);

export default router;
