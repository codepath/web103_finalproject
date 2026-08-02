// Mounted at /api/trips/:tripId/expenses — list all expenses for a trip, or create a new one.
import { Router } from "express";
import {getAllExpenses, getExpensesSummary, createExpense} from "../controllers/expenses.js";

const router = Router({ mergeParams: true });

router.get("/", getAllExpenses);
router.get("/summary", getExpensesSummary);
router.post("/", createExpense);

export default router;