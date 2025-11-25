import { supabase } from "../config/supabase.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("user").select("*");

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("user")
      .update(req.body)
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("user").delete().eq("id", id);

    if (error) throw error;
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add friend
export const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    
    console.log('=== ADD FRIEND DEBUG ===');
    console.log('User ID:', userId);
    console.log('Friend ID:', friendId);
    
    // Get current user
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("follows_ids")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    
    console.log('Current follows_ids:', user.follows_ids);

    // Update follows_ids (add the friend)
    const currentFollows = user.follows_ids || {};
    currentFollows[friendId] = true;
    
    console.log('Updated follows_ids:', currentFollows);

    const { data, error } = await supabase
      .from("user")
      .update({ follows_ids: currentFollows })
      .eq("id", userId)
      .select();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    
    console.log('Database response:', data);
    console.log('First item:', data?.[0]);
    console.log('=== END ADD FRIEND DEBUG ===');
    
    res.json(data?.[0] || { success: true });
  } catch (error) {
    console.error('Error in addFriend:', error);
    res.status(500).json({ error: error.message });
  }
};

// Remove friend
export const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    
    // Get current user
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("follows_ids")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Update follows_ids (remove the friend)
    const currentFollows = user.follows_ids || {};
    delete currentFollows[friendId];

    const { data, error } = await supabase
      .from("user")
      .update({ follows_ids: currentFollows })
      .eq("id", userId)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's friends
export const getFriends = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user's follows_ids
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("follows_ids")
      .eq("id", id)
      .single();

    if (userError) throw userError;

    const followsIds = user.follows_ids || {};
    const friendIds = Object.keys(followsIds).filter(fId => followsIds[fId]);

    if (friendIds.length === 0) {
      return res.json([]);
    }

    // Fetch all friends' data
    const { data: friends, error } = await supabase
      .from("user")
      .select("id, username, pfp, interests")
      .in("id", friendIds);

    if (error) throw error;
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
