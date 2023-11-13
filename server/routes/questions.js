import express from "express";
import QuestionController from '../controllers/questions.js'

// const express = require('express');
// const QuestionController = require('../controllers/questions.js');

const router =  express.Router()

router.get('/', QuestionController.getQuestions)
router.post('/', QuestionController.createQuestion)
router.get('/:id', QuestionController.getQuestionById)

export default router;