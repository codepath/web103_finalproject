import { Router } from "express";
import {
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenses.js";

const router = Router();

router.get("/:id", getExpenseById);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
