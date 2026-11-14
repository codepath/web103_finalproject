import { Router } from 'express';
import { getMealPlan, addMealPlanEntry, updateMealPlanEntry, deleteMealPlanEntry } from '../controllers/mealPlanController.js';

const router = Router();

router.get("/", getMealPlan);
router.post("/", addMealPlanEntry);
router.patch("/:id", updateMealPlanEntry);
router.delete("/:id", deleteMealPlanEntry);


export default router;