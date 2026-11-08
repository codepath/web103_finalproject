import { Router } from "express";
import { requireMember, requireOrganizer } from "../middleware/access.js";
import { createTrip, deleteTrip, getTrip, listTrips, updateTrip } from "../controllers/trips.js";

import { joinTrip, listMembers } from "../controllers/members.js";

const router = Router();

router.get("/", listTrips);
router.post("/", createTrip);
router.post("/join", joinTrip);
router.get("/:tripId", requireMember, getTrip);
router.get("/:tripId/members", requireMember, listMembers);
router.patch("/:tripId", requireMember, requireOrganizer, updateTrip);
router.delete("/:tripId", requireMember, requireOrganizer, deleteTrip);

export default router;
