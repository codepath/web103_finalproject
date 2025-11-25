import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getFriends } from "../services/userService";
import {
  getUserConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
} from "../services/messageService";
import "./Messages.css";

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
      loadFriends();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id, user.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getUserConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const data = await getFriends(user.id);
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await getConversationMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleStartConversation = async (friend) => {
    try {
      const conversation = await getOrCreateConversation(user.id, friend.id);
      setShowFriendsList(false);
      
      // Add other user info to conversation
      const conversationWithUser = {
        ...conversation,
        otherUser: friend,
      };
      
      setSelectedConversation(conversationWithUser);
      loadConversations(); // Refresh list
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation.id, user.id, newMessage);
      setNewMessage("");
      loadMessages(selectedConversation.id);
      loadConversations(); // Refresh to update last_message_at
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="messages-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <Link to="/home" className="back-button">
            ← Back
          </Link>
          <button
            className="new-chat-button"
            onClick={() => setShowFriendsList(!showFriendsList)}
          >
            + New Chat
          </button>
        </div>

        {showFriendsList && (
          <div className="friends-list-popup">
            <h4>Message a Friend</h4>
            {friends.length === 0 ? (
              <p className="no-friends">No friends yet. Add friends to chat!</p>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="friend-item"
                  onClick={() => handleStartConversation(friend)}
                >
                  {friend.pfp && (
                    <img src={friend.pfp} alt={friend.username} className="friend-avatar" />
                  )}
                  <span>{friend.username}</span>
                </div>
              ))
            )}
          </div>
        )}

        <div className="chats-list">
          {loading ? (
            <div className="loading">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet.</p>
              <p>Start chatting with your friends!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`chat-item ${
                  selectedConversation?.id === conv.id ? "active" : ""
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="chat-avatar">
                  {conv.otherUser?.pfp ? (
                    <img src={conv.otherUser.pfp} alt={conv.otherUser.username} />
                  ) : (
                    conv.otherUser?.username?.[0] || "?"
                  )}
                </div>
                <div className="chat-info">
                  <h4>{conv.otherUser?.username || "Unknown User"}</h4>
                  <p className="last-message">
                    {new Date(conv.last_message_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-window">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar-large">
                  {selectedConversation.otherUser?.pfp ? (
                    <img
                      src={selectedConversation.otherUser.pfp}
                      alt={selectedConversation.otherUser.username}
                    />
                  ) : (
                    selectedConversation.otherUser?.username?.[0] || "?"
                  )}
                </div>
                <h3>{selectedConversation.otherUser?.username || "Unknown User"}</h3>
              </div>
            </div>

            <div className="messages-area">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${
                    message.sender_id === user.id ? "my-message" : "their-message"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="message-time">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-container" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                className="message-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a conversation or start a new chat</h3>
            <p>Choose a friend from your conversations or click "+ New Chat"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
