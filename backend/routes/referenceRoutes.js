import { Router } from "express";
import { listUnits, listIngredients } from "../controllers/referenceController.js";

const router = Router();

router.get("/units", listUnits);
router.get("/ingredients", listIngredients);

export default router;
