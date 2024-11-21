import express from 'express';
import IncomeControllers from '../controllers/income.js';

const router = express.Router();


router.get('/:user_id', IncomeControllers.getIncome);
router.get('/:id', IncomeControllers.getIncomeById);
router.post('/add', IncomeControllers.addIncome);
router.put('/update/:id', IncomeControllers.updateIncome);
router.delete('/delete/:id', IncomeControllers.deleteIncome);

export default router;
