import express from "express";
import {
  getUserConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  markAsRead,
} from "../controllers/messages.js";

const router = express.Router();

router.get("/conversations/:userId", getUserConversations);
router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:conversationId/messages", getConversationMessages);
router.post("/send", sendMessage);
router.post("/read", markAsRead);

export default router;
