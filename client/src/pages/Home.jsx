import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../services/postService";
import { getFriends } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import "./Posts.css";

function Home() {
  const { user } = useAuth(); // Get current user from auth context
  
  const groups = [
    { id: 1, name: "CS_Club", image: "💻", members: 45 },
    { id: 2, name: "Art_Lovers", image: "🎨", members: 32 },
    { id: 3, name: "Foodies_NYC", image: "🍕", members: 67 },
    { id: 4, name: "Book_Club", image: "📚", members: 28 },
    { id: 5, name: "Fitness_Gang", image: "💪", members: 54 },
    { id: 6, name: "Music_Makers", image: "🎵", members: 41 },
  ];

  // Post state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);

  // Friends state
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);

  // Form state
  const [newPost, setNewPost] = useState({
    caption: "",
    content: "",
    image_url: "",
  });

  const [editForm, setEditForm] = useState({
    caption: "",
    content: "",
    image_url: "",
  });

  // Fetch posts and friends on component mount
  useEffect(() => {
    fetchPosts();
    if (user?.id) {
      fetchFriends();
    }
  }, [user?.id]);

  const fetchFriends = async () => {
    try {
      setFriendsLoading(true);
      const data = await getFriends(user.id);
      setFriends(data || []);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setFriendsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts();
      console.log("Frontend received posts:", data); // Debug log
      setPosts(data || []);
    } catch (err) {
      setError("Failed to load posts. Make sure the server is running.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        caption: newPost.caption,
        content: newPost.content,
        user_id: user?.id || "anonymous", // Use actual user ID from auth context
      };
      // Only include image_url if it's not empty
      if (newPost.image_url && newPost.image_url.trim()) {
        postData.image_url = newPost.image_url;
      }
      await createPost(postData);
      setNewPost({ caption: "", content: "", image_url: "" });
      fetchPosts(); // Refresh the list
    } catch (err) {
      alert("Failed to create post: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        fetchPosts(); // Refresh the list
      } catch (err) {
        alert("Failed to delete post: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditForm({
      caption: post.caption || "",
      content: post.content || "",
      image_url: post.image_url || "",
    });
  };

  const handleUpdatePost = async (e, id) => {
    e.preventDefault();
    try {
      const updateData = {
        caption: editForm.caption,
        content: editForm.content,
      };
      // Only include image_url if it's not empty
      if (editForm.image_url && editForm.image_url.trim()) {
        updateData.image_url = editForm.image_url;
      }
      await updatePost(id, updateData);
      setEditingPostId(null);
      fetchPosts(); // Refresh the list
    } catch (err) {
      alert("Failed to update post: " + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditForm({ caption: "", content: "", image_url: "" });
  };


  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Lexington Links</h2>
        </div>
        <div className="nav-links">
          <Link to={user?.id ? `/profile/${user.id}` : '/'} className="nav-button">
            Profile
          </Link>
          <button className="nav-button">Brew Random Group</button>
          <Link to="/messages" className="nav-button">
            Messages
          </Link>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search groups..."
              className="search-input"
            />
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-header">
          <h1>Discover Groups</h1>
          <p>Find your community and connect with like-minded students</p>
        </div>

        <div className="groups-grid">
          {groups.map((group) => (
            <div key={group.id} className="group-card">
              <div className="group-icon">{group.image}</div>
              <h3>{group.name}</h3>
              <p className="member-count">{group.members} members</p>
              <button className="join-button">Join Group</button>
            </div>
          ))}
        </div>

        {/* Friends Section */}
        <div className="friends-section">
          <div className="friends-header">
            <h2>My Friends</h2>
            <Link to="/user-lookup" className="add-friend-link">
              + Add Friends
            </Link>
          </div>
          
          {friendsLoading ? (
            <div className="loading">Loading friends...</div>
          ) : friends.length === 0 ? (
            <div className="empty-state">
              <p>No friends yet. Start adding friends from User Lookup!</p>
            </div>
          ) : (
            <div className="friends-grid">
              {friends.map((friend) => (
                <div key={friend.id} className="friend-card">
                  {friend.pfp && (
                    <img src={friend.pfp} alt={friend.username} className="friend-pfp" />
                  )}
                  <div className="friend-info">
                    <h4>{friend.username}</h4>
                    {friend.interests && (
                      <div className="friend-interests">
                        {Object.keys(friend.interests).slice(0, 3).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="post-feed">
          <h2>Community Posts</h2>

          {/* Create Post Form */}
          <div className="create-post-card">
            <h3>Create a New Post</h3>
            <form className="create-post-form" onSubmit={handleCreatePost}>
              <input
                type="text"
                className="form-input"
                placeholder="Caption"
                value={newPost.caption}
                onChange={(e) =>
                  setNewPost({ ...newPost, caption: e.target.value })
                }
                required
              />
              <textarea
                className="form-textarea"
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                required
              />
              <input
                type="url"
                className="form-input"
                placeholder="Image URL (optional)"
                value={newPost.image_url}
                onChange={(e) =>
                  setNewPost({ ...newPost, image_url: e.target.value })
                }
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && <div className="error">{error}</div>}

          {/* Loading State */}
          {loading && <div className="loading">Loading posts...</div>}

          {/* Posts List */}
          {!loading && !error && (
            <div className="posts-container">
              {posts.length === 0 ? (
                <div className="empty-state">
                  <h3>No posts yet</h3>
                  <p>Be the first to create a post!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <div className="post-meta">
                        <div className="post-user">
                          {post.user?.username || "Anonymous"}
                        </div>
                        <div className="post-date">
                          {post.created_at
                            ? new Date(post.created_at).toLocaleString()
                            : "Just now"}
                        </div>
                      </div>
                      <div className="post-actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEditClick(post)}
                          title="Edit"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeletePost(post.id)}
                          title="Delete"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>

                    {editingPostId === post.id ? (
                      <form
                        className="edit-post-form"
                        onSubmit={(e) => handleUpdatePost(e, post.id)}
                      >
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Caption"
                          value={editForm.caption}
                          onChange={(e) =>
                            setEditForm({ ...editForm, caption: e.target.value })
                          }
                          required
                        />
                        <textarea
                          className="form-textarea"
                          placeholder="Content"
                          value={editForm.content}
                          onChange={(e) =>
                            setEditForm({ ...editForm, content: e.target.value })
                          }
                          required
                        />
                        <input
                          type="url"
                          className="form-input"
                          placeholder="Image URL (optional)"
                          value={editForm.image_url}
                          onChange={(e) =>
                            setEditForm({ ...editForm, image_url: e.target.value })
                          }
                        />
                        <div className="form-actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Update
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="post-content">
                        {post.caption && (
                          <div className="post-caption">{post.caption}</div>
                        )}
                        {post.content && (
                          <div className="post-text">{post.content}</div>
                        )}
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.caption || "Post"}
                            className="post-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
