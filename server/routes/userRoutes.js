import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve the user's profile information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 diet_preferences:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Array of user's diet preferences
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Account creation timestamp
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user profile
 */
router.get('/profile', authMiddleware, userController.getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the user's profile information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: The new username for the user
 *               email:
 *                 type: string
 *                 description: The new email for the user
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                   description: The user's updated username
 *                 email:
 *                   type: string
 *                   description: The user's updated email
 *       500:
 *         description: Error updating profile
 */
router.put('/profile', authMiddleware, userController.updateUserProfile);

/**
 * @swagger
 * /api/users/diets:
 *   put:
 *     summary: Update the user's diet preferences
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diets:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of diet IDs representing user's diet preferences
 *     responses:
 *       200:
 *         description: User diet preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 diet_preferences:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Updated array of user's diet preferences
 *       500:
 *         description: Error updating diet preferences
 */
router.put('/diets', authMiddleware, userController.updateUserDietPreferences);

export default router;