import express from 'express';
import savingGoalController from '../controllers/savingGoal.js';

const router = express.Router();


// GET /goals to retrieve goals for the user
router.get('/:user_id', savingGoalController.getGoals);

// POST /goals to add a new savings goal
router.post('/', savingGoalController.addGoal);

// PUT /goals/:goal_id to update current savings amount
router.put('/:goal_id', savingGoalController.updateGoal);

// DELETE /goals/:goal_id to remove a goal
router.delete('/:goal_id', savingGoalController.deleteGoal);

export default router;