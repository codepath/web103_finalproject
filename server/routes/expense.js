import express from 'express';
import ExpenseControllers from '../controllers/expense.js';

const router = express.Router();


router.get('/:user_id', ExpenseControllers.getExpenses); //user_id
router.get('/:id', ExpenseControllers.getExpensesById);
router.post('/add', ExpenseControllers.addExpenses);
router.put('/update/:id', ExpenseControllers.updateExpenses);
router.delete('/delete/:id', ExpenseControllers.deleteExpenses);

export default router;

