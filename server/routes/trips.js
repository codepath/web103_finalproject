import { Router } from "express";
import { requireMember, requireOrganizer } from "../middleware/access.js";
import { createTrip, deleteTrip, getTrip, listTrips, updateTrip } from "../controllers/trips.js";

import { joinTrip, listMembers } from "../controllers/members.js";
import { createActivity, listActivities } from "../controllers/activities.js";

const router = Router();

router.get("/", listTrips);
router.post("/", createTrip);
router.post("/join", joinTrip);
router.get("/:tripId", requireMember, getTrip);
router.get("/:tripId/members", requireMember, listMembers);
router.get("/:tripId/activities", requireMember, listActivities);
router.post("/:tripId/activities", requireMember, createActivity);
router.patch("/:tripId", requireMember, requireOrganizer, updateTrip);
router.delete("/:tripId", requireMember, requireOrganizer, deleteTrip);

export default router;
