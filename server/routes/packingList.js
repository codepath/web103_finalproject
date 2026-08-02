import { Router } from "express";
import {
  getAllPackingListItems,
  getPackingListItemById,
  createPackingListItem,
  updatePackingListItem,
  deletePackingListItem,
} from "../controllers/packingList.js";

const router = Router();

router.get("/:id", getPackingListItemById);
router.patch("/:id", updatePackingListItem);
router.delete("/:id", deletePackingListItem);

export default router;
