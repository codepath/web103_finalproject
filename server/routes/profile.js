import express from 'express';
import updateUserProfile from '../controllers/profile.js'

const router = express.Router();

router.put('/profile', ProfileController.updateUserProfile)

export default router;