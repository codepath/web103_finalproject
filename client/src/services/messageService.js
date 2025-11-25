import api from "./api";

// Get all conversations for a user
export const getUserConversations = async (userId) => {
  const response = await api.get(`/messages/conversations/${userId}`);
  return response.data;
};

// Get or create conversation between two users
export const getOrCreateConversation = async (user1Id, user2Id) => {
  const response = await api.post("/messages/conversations", { user1Id, user2Id });
  return response.data;
};

// Get messages in a conversation
export const getConversationMessages = async (conversationId) => {
  const response = await api.get(`/messages/conversations/${conversationId}/messages`);
  return response.data;
};

// Send a message
export const sendMessage = async (conversationId, senderId, content) => {
  const response = await api.post("/messages/send", {
    conversation_id: conversationId,
    sender_id: senderId,
    content,
  });
  return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId, userId) => {
  const response = await api.post("/messages/read", { conversationId, userId });
  return response.data;
};
