import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Profile.css";
import defaultPfp from '../assets/default.jpg';

function Profile() {
  const navigate = useNavigate();
  const { profileId } = useParams(); // ✅ Correctly destructure profileId from the URL

  const [loading, setLoading] = useState(true);
  const [currentViewer, setCurrentViewer] = useState(null); // The logged-in user object
  const [isOwnProfile, setIsOwnProfile] = useState(false); // Flag for conditional UI
  
  // Profile Form State
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    bio: "",
    pfp_url: defaultPfp,
  });

  // Post Form State
  const [posts, setPosts] = useState([]);
  const [postCaption, setPostCaption] = useState("");
  const [postImage, setPostImage] = useState(null); // File object
  const [uploading, setUploading] = useState(false); // For upload status

  useEffect(() => {
    getProfileAndPosts();
  }, [profileId]);

  const getProfileAndPosts = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) { navigate("/"); return; } 
      setCurrentViewer(user);

      // --- Determine Fetch Target and Ownership ---
      // 1. Check if the logged-in user is the one whose profile is being viewed.
      const targetId = profileId;
      setIsOwnProfile(user.id === targetId); 

      // 2. Fetch the TARGET Profile (using the ID from the URL/target)
      const { data: profile, error: profileError } = await supabase
        .from("user")
        .select("*")
        .eq("id", targetId)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setFormData({
          username: profile.username || "",
          display_name: profile.display_name || profile.username || "",
          bio: profile.bio || "",
          pfp_url: profile.pfp || defaultPfp,
        });
      }

      // 3. Fetch Posts for the TARGET Profile
      const { data: postsData } = await supabase
        .from("post")
        .select("*")
        .eq("user_id", targetId)
        .order("created_at", { ascending: false });
      
      setPosts(postsData || []);

    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- File Upload Helper ---
  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    // Files are uploaded directly to the images bucket root for simplicity
    const filePath = `${fileName}`; 

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- Update Profile (only runs if isOwnProfile is true due to RLS) ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let pfpUrl = formData.pfp_url;

      const fileInput = document.getElementById('pfp-upload');
      if (fileInput && fileInput.files.length > 0) {
        pfpUrl = await uploadFile(fileInput.files[0]);
      }

      const { error } = await supabase
        .from("user")
        .update({
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio,
          pfp: pfpUrl,
        })
        .eq("id", currentViewer.id); // Must use currentViewer.id for RLS check

      if (error) throw error;
      alert("Profile updated!");
      setFormData(prev => ({ ...prev, pfp_url: pfpUrl }));

    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- Create Post (only runs if isOwnProfile is true) ---
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postCaption.trim() && !postImage) return;
    
    setUploading(true);
    try {
      let imageUrl = null;
      if (postImage) {
        imageUrl = await uploadFile(postImage);
      }

      const { error } = await supabase
        .from('post')
        .insert([{ 
          user_id: currentViewer.id, // Must use currentViewer.id
          caption: postCaption,
          image_url: imageUrl,
          content: postCaption, // Add content field to match your schema
        }]);

      if (error) throw error;

      setPostCaption("");
      setPostImage(null);
      getProfileAndPosts(); 

    } catch (error) {
      alert("Error posting: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
            {/* PFP Display */}
            <img src={formData.pfp_url} alt="Profile" className="profile-avatar" />
            <div>
                <h1>@{formData.username || "username"}</h1>
                <p className="subtitle">{formData.display_name}</p>
                <button onClick={() => navigate("/home")} className="back-btn">← Home</button>
            </div>
        </div>

        {/* =================================================== */}
        {/* --- 1. EDIT FORM / STATIC BIO (Conditional View) --- */}
        {/* =================================================== */}
        {isOwnProfile ? (
            // VIEW A: OWN PROFILE (Editable Form)
            <form onSubmit={handleProfileUpdate} className="profile-form">
                <h3>Edit Profile</h3>
                
                <div className="form-group">
                    <label>Profile Picture</label>
                    <input type="file" id="pfp-upload" accept="image/*" />
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                    />
                </div>

                <button type="submit" disabled={uploading} className="save-btn">
                  {uploading ? "Uploading..." : "Save Changes"}
                </button>
            </form>
        ) : (
            // VIEW B: OTHER USER'S PROFILE (Static View)
            <div className="profile-static-info">
                <h3>{formData.display_name}'s Info</h3>
                <div className="form-group">
                    <label>Bio</label>
                    <p>{formData.bio || 'This user has not set a bio yet.'}</p>
                </div>
                {/* Displaying static interests and location could go here */}
            </div>
        )}

        <hr className="divider" />

        {/* =================================================== */}
        {/* --- 2. CREATE POST FORM (Conditional: Only for owner) --- */}
        {/* =================================================== */}
        {isOwnProfile && (
            <form onSubmit={handleCreatePost} className="create-post-form-profile">
                <h3>Create Post</h3>
                <textarea
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="What's on your mind?"
                />
                
                <div className="file-input-wrapper">
                  <label>Add Image:</label>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setPostImage(e.target.files[0])}
                  />
                </div>

                <button type="submit" disabled={uploading}>
                  {uploading ? "Posting..." : "Post"}
                </button>
            </form>
        )}

        <hr className="divider" />

        {/* =================================================== */}
        {/* --- 3. POSTS LIST (Posts for the viewed profile) --- */}
        {/* =================================================== */}
        <div className="posts-list-profile">
          <h3>{isOwnProfile ? "Your Posts" : `Posts by ${formData.display_name}`}</h3>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card-profile">
                {post.image_url && (
                    <img src={post.image_url} alt="Post" className="post-image" />
                )}
                <p className="post-caption">{post.caption}</p>
                <span className="post-time">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
             <p>{isOwnProfile ? "You haven't posted anything yet." : `${formData.display_name} hasn't posted anything yet.`}</p>
          )}
        </div>

        {/* =================================================== */}
        {/* --- 4. SIGN OUT BUTTON (Conditional: Only for owner) --- */}
        {/* =================================================== */}
        {isOwnProfile && (
            <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="signout-btn">
              Sign Out
            </button>
        )}
      </div>
    </div>
  );
}

export default Profile;