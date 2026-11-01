import express from 'express'
import AssignmentsController from '../controllers/assignments.js'

const router = express.Router()

router.post('/', AssignmentsController.createAssignment)

export default router
