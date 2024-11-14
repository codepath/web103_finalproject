import express from 'express';
import ExpenseControllers from '../controllers/expense.js';

const router = express.Router();

router.post('/add', ExpenseControllers.addExpenses);
router.get('/get', ExpenseControllers.getExpenses);
router.get('/get/:id', ExpenseControllers.getExpensesById);
router.put('/update/:id', ExpenseControllers.updateExpenses);
router.delete('/delete/:id', ExpenseControllers.deleteExpenses);

export default router;

