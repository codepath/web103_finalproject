import express from 'express'
import { getCommentsByMatch, createComment, deleteComment } from '../controllers/commentsController.js'

const router = express.Router()

// GET /api/comments/match/:matchId
router.get('/match/:matchId', getCommentsByMatch)

// POST /api/comments
router.post('/', createComment)

// DELETE /api/comments/:id
router.delete('/:id', deleteComment)

export default router
