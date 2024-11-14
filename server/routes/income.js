import express from 'express';
import IncomeControllers from '../controllers/income.js';

const router = express.Router();

router.post('add', IncomeControllers.addIncome);
router.get('/get', IncomeControllers.getIncome);
router.get('/get/:id', IncomeControllers.getIncomeById);
router.put('/update/:id', IncomeControllers.updateIncome);
router.delete('/delete/:id', IncomeControllers.deleteIncome);

export default router;
