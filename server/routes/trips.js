import { Router } from "express";
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../controllers/trips.js";

const router = Router();

router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.post("/", createTrip);
router.patch("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
