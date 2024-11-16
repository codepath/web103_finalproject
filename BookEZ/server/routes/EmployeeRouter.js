import express from 'express'

import EmployeeController from '../controllers/EmployeeController.js'

const router = express.Router();

router.get('/:salon_id', EmployeeController.getEmployeeBySalonId)

export default router;
