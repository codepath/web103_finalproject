import express from 'express'
import ChatbotController from '../controllers/chatbot.js'

const router = express.Router()

router.post('/', ChatbotController.chat)

export default router
