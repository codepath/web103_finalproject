# Messaging System Documentation

## Overview

The Lexington Links messaging system allows users to send direct messages to their friends in real-time. Users can only message people they have added as friends (stored in their `follows_ids`).

---

## Database Schema

### Table: `conversations`
Stores one-on-one chat conversations between two users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | Unique conversation ID (auto-generated) |
| `created_at` | timestamp | When the conversation was created |
| `user_id_1` | integer | ID of first participant (always smaller) |
| `user_id_2` | integer | ID of second participant (always larger) |
| `last_message_at` | timestamp | Timestamp of the most recent message |

**Key Points:**
- `user_id_1` is always less than `user_id_2` to prevent duplicate conversations
- Unique constraint ensures only one conversation exists between two users

### Table: `messages`
Stores individual messages within conversations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | Unique message ID (auto-generated) |
| `created_at` | timestamp | When the message was sent |
| `conversation_id` | integer | References `conversations.id` |
| `sender_id` | integer | User ID of who sent the message |
| `content` | text | The actual message text |
| `read` | boolean | Whether the message has been read (default: false) |

**Key Points:**
- Foreign key to `conversations` with CASCADE delete
- Messages are deleted if their conversation is deleted

---

## How It Works

### 1. Starting a Conversation

**User Journey:**
1. User clicks "+ New Chat" on the Messages page
2. A list of their friends appears
3. User clicks on a friend to start chatting

**What Happens:**
```javascript
// Frontend calls:
getOrCreateConversation(user.id, friend.id)

// Backend checks if conversation exists between these users
// If not, creates new conversation with user_id_1 < user_id_2
```

### 2. Sending Messages

**User Journey:**
1. User types message in the chat window
2. Clicks "Send" button
3. Message appears instantly in the chat

**What Happens:**
```javascript
// Frontend calls:
sendMessage(conversationId, senderId, content)

// Backend:
// 1. Inserts message into messages table
// 2. Updates conversation's last_message_at timestamp
```

### 3. Viewing Conversations

**User Journey:**
1. User navigates to `/messages`
2. Sees list of all their conversations (sorted by most recent)
3. Each conversation shows the other person's name and profile picture

**What Happens:**
```javascript
// Frontend calls:
getUserConversations(userId)

// Backend:
// 1. Finds all conversations where user is participant
// 2. For each conversation, fetches the OTHER user's info
// 3. Returns conversations sorted by last_message_at (newest first)
```

### 4. Reading Messages

**User Journey:**
1. User clicks on a conversation
2. All messages in that conversation load
3. Messages are automatically marked as read

**What Happens:**
```javascript
// Frontend calls:
getConversationMessages(conversationId)
markMessagesAsRead(conversationId, userId)

// Backend:
// 1. Fetches all messages for that conversation (oldest first)
// 2. Marks unread messages (where sender ≠ current user) as read
```

---

## API Endpoints

### Get User's Conversations
```
GET /api/messages/conversations/:userId
```
Returns all conversations for a user with the other participant's info.

### Create or Get Conversation
```
POST /api/messages/conversations
Body: { user1Id, user2Id }
```
Finds existing conversation or creates a new one.

### Get Conversation Messages
```
GET /api/messages/conversations/:conversationId/messages
```
Returns all messages in a conversation (chronological order).

### Send Message
```
POST /api/messages/send
Body: { conversation_id, sender_id, content }
```
Sends a new message and updates conversation timestamp.

### Mark as Read
```
POST /api/messages/read
Body: { conversationId, userId }
```
Marks all unread messages in a conversation as read.

---

## Frontend Components

### Messages Page (`/messages`)

**Layout:**
- **Left Sidebar:** List of conversations
- **Right Panel:** Active chat window

**Features:**
- "+ New Chat" button to start new conversations
- Shows friend's profile picture and name
- Auto-scrolls to newest message
- Real-time message sending
- Timestamps for all messages

**State Management:**
```javascript
conversations     // List of all user's conversations
selectedConversation  // Currently active conversation
messages         // Messages in selected conversation
friends          // User's friends list
newMessage       // Current message being typed
```

---

## Friend Restriction

Users can **only message people they follow**. This is enforced by:

1. **Friend List:** Only friends appear in "+ New Chat" popup
2. **Backend Logic:** Conversations are created between any two users (no restriction)
3. **Frontend UX:** Users can only discover/start chats with friends

**To add friends:**
1. Go to User Lookup page
2. Search for username
3. Click "Add Friend"

---

## Example Flow

**Alice wants to message Bob:**

1. Alice goes to `/messages`
2. Clicks "+ New Chat"
3. Sees Bob in her friends list (she added him earlier)
4. Clicks Bob's name
5. System creates conversation with `user_id_1=1 (Alice), user_id_2=2 (Bob)`
6. Alice types "Hey Bob!"
7. Message is inserted: `{conversation_id: 1, sender_id: 1, content: "Hey Bob!"}`
8. Bob sees the conversation appear in his messages list
9. Bob opens it and replies
10. Both see the full conversation history

---

## File Structure

```
server/
  controllers/messages.js   # Backend logic
  routes/messages.js        # API routes
  tables/
    setup_messaging.sql     # Database setup script

client/
  src/
    pages/Messages.jsx      # Main messaging UI
    services/messageService.js  # API calls
```

---

## Future Enhancements

Possible features to add:
- Real-time updates (WebSockets)
- Message editing/deletion
- Image/file attachments
- Group messaging
- Typing indicators
- Message reactions
- Search within conversations
