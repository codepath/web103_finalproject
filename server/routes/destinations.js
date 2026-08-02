// Mounted at /api/destinations — get a single destination, or edit/delete it by its own id.
import { Router } from "express";
import {
  getDestinationById,
  updateDestination,
  deleteDestination,
} from "../controllers/destinations.js";

const router = Router();

router.get("/:id", getDestinationById);
router.patch("/:id", updateDestination);
router.delete("/:id", deleteDestination);

export default router;
