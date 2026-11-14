import { Router } from "express";
import {
  deleteExpense,
  loadExpense,
  updateExpense,
} from "../controllers/expenses.js";

const router = Router();

router.patch("/:expenseId", loadExpense, updateExpense);
router.delete("/:expenseId", loadExpense, deleteExpense);

export default router;
