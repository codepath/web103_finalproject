import { supabase } from "../config/supabase.js";

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get conversations where user is participant
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (error) throw error;

    // For each conversation, get the other user's info
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.user_id_1 === userId ? conv.user_id_2 : conv.user_id_1;
        
        const { data: otherUser } = await supabase
          .from("user")
          .select("id, username, pfp")
          .eq("id", otherUserId)
          .single();

        return {
          ...conv,
          otherUser,
        };
      })
    );

    res.json(conversationsWithUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get or create conversation between two users
export const getOrCreateConversation = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;
    // Sort UUIDs alphabetically to ensure consistent ordering
    const [smallerId, largerId] = [user1Id, user2Id].sort();

    // Try to find existing conversation
    let { data: conversation, error: findError } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id_1", smallerId)
      .eq("user_id_2", largerId)
      .single();

    // If doesn't exist, create it
    if (!conversation) {
      const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert([{ user_id_1: smallerId, user_id_2: largerId }])
        .select()
        .single();

      if (createError) throw createError;
      conversation = newConv;
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages in a conversation
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, content } = req.body;

    // Create the message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert([{ conversation_id, sender_id, content }])
      .select()
      .single();

    if (messageError) throw messageError;

    // Update conversation's last_message_at
    const { error: updateError } = await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversation_id);

    if (updateError) throw updateError;

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("read", false);

    if (error) throw error;
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
