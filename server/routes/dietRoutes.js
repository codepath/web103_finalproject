import express from 'express';
import dietController from '../controllers/dietController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/diets:
 *   get:
 *     summary: Retrieve a list of available diets
 *     tags: [Diets]
 *     responses:
 *       200:
 *         description: A list of diets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The diet ID
 *                   diet_name:
 *                     type: string
 *                     description: The name of the diet
 *                   description:
 *                     type: string
 *                     description: A brief description of the diet
 */
router.get('/', authMiddleware, dietController.getDiets);

export default router;