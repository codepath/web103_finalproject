import { Router } from "express";
import { listPantry, addPantryItem, updatePantryItem, deletePantryItem } from "../controllers/pantryController.js";

const router = Router();

router.get("/", listPantry);
router.post("/", addPantryItem);
router.patch("/:id", updatePantryItem);
router.delete("/:id", deletePantryItem);

export default router;
