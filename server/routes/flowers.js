import { Router } from "express";
import {
  getFlowers,
  getFlowerById,
  getFlowerMeanings,
  createFlower,
  updateFlower,
  deleteFlower,
} from "../controllers/flowers.js";

const router = Router();

router.get("/", getFlowers);
router.get("/meanings", getFlowerMeanings);
router.get("/:id", getFlowerById);
router.post("/", createFlower);
router.patch("/:id", updateFlower);
router.delete("/:id", deleteFlower);

export default router;
