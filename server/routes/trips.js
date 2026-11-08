import { Router } from "express";
import { requireMember, requireOrganizer } from "../middleware/access.js";
import { createTrip, deleteTrip, getTrip, listTrips, updateTrip } from "../controllers/trips.js";

const router = Router();

router.get("/", listTrips);
router.post("/", createTrip);
router.get("/:tripId", requireMember, getTrip);
router.patch("/:tripId", requireMember, requireOrganizer, updateTrip);
router.delete("/:tripId", requireMember, requireOrganizer, deleteTrip);

export default router;
