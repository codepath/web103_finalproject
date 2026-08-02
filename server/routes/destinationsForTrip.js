// Mounted at /api/trips/:tripId/destinations — list all destinations for a trip, or create a new one.
import { Router } from "express";
import { getDestinationsForTrip, createDestination } from "../controllers/destinations.js";

const router = Router({ mergeParams: true });

router.get("/", getDestinationsForTrip);
router.post("/", createDestination);

export default router;
