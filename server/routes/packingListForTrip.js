// Mounted at /api/trips/:tripId/packing-list — list all packing lists for a trip, or create a new one.
import { Router } from "express";
import {getAllPackingListItems, createPackingListItem, generatePackingItems } from "../controllers/packingList.js";

const router = Router({ mergeParams: true });

router.get("/", getAllPackingListItems);
router.post("/", createPackingListItem);
router.post("/generate", generatePackingItems);

export default router;
