import express from 'express';
import sessionsController from '../controllers/sessions.js';
const router = express.Router();

router.post('/add', sessionsController.createSession);
router.get('/group/:group_id', sessionsController.getSessionsByGroup);
router.delete('/:id', sessionsController.deleteSession);
router.get('/', sessionsController.getAllSessions);
router.post('/vote', sessionsController.voteForSession);

export default router;
