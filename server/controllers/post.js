import { supabase } from "../config/supabase.js";

// Get all posts
export const getPosts = async (req, res) => {
  try {
    console.log("=== FETCHING POSTS - VERSION 2.0 ===");
    
    // Get all posts
    const { data: posts, error: postsError } = await supabase
      .from("post")
      .select("*")
      .order("created_at", { ascending: false });

    if (postsError) throw postsError;
    
    console.log("Posts fetched:", posts);

    // For each post, fetch the user - EXACTLY like user lookup does
    const postsWithUsers = [];
    for (const post of posts) {
      console.log(`\n--- Processing post ${post.id} ---`);
      console.log(`Post user_id: "${post.user_id}" (type: ${typeof post.user_id})`);
      
      if (post.user_id && post.user_id !== 'anonymous') {
        console.log(`Fetching user with id: "${post.user_id}"`);
        
        // Fetch user EXACTLY like getUserById does
        const { data: user, error: userError } = await supabase
          .from("user")
          .select("*")
          .eq("id", post.user_id)
          .single();
        
        console.log("User fetch result:", user);
        console.log("User fetch error:", userError);
        
        postsWithUsers.push({
          ...post,
          user: user
        });
      } else {
        console.log("Skipping user fetch (anonymous or no user_id)");
        postsWithUsers.push(post);
      }
    }

    console.log("\n=== FINAL RESULT ===");
    console.log(JSON.stringify(postsWithUsers, null, 2));
    
    res.json(postsWithUsers);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("post")
      .select(`
        *,
        user:user!user_id (
          id,
          username
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create post
export const createPost = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("post")
      .update(req.body)
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("post").delete().eq("id", id);

    if (error) throw error;
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
