import { useState } from "react";
import { getUserByUsername, addFriend, removeFriend } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import "./UserLookup.css";

function UserLookup() {
  const { user } = useAuth(); // Get current logged-in user
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserData(null);

    try {
      const data = await getUserByUsername(username);
      console.log("User data received:", data);
      setUserData(data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("User under this name not found. Please check the spelling and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!user?.id || !userData?.id) return;
    
    setActionLoading(true);
    try {
      await addFriend(user.id, userData.id);
      alert(`Added ${userData.username} as a friend!`);
    } catch (err) {
      console.error("Error adding friend:", err);
      alert("Failed to add friend: " + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const isSelf = user?.id && userData?.id && user.id.toString() === userData.id.toString();

  return (
    <div className="user-lookup-container">
      <div className="user-lookup-card">
        <h2>User Lookup</h2>
        <p>Enter a username to find and add friends</p>

        <form onSubmit={handleLookup} className="lookup-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username (e.g., George Demo)"
            className="lookup-input"
            required
          />
          <button type="submit" className="lookup-button" disabled={loading}>
            {loading ? "Loading..." : "Search User"}
          </button>
        </form>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {userData && (
          <div className="user-result">
            <h3>User Found!</h3>
            <div className="user-details">
              {userData.pfp && (
                <img src={userData.pfp} alt={userData.username} className="user-pfp" />
              )}
              <p><strong>Username:</strong> {userData.username || "(no username)"}</p>
              {userData.interests && (
                <div>
                  <strong>Interests:</strong>
                  <div className="interests-tags">
                    {Object.keys(userData.interests).map(interest => (
                      <span key={interest} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {!isSelf && user?.id && (
                <button 
                  onClick={handleAddFriend} 
                  className="add-friend-button"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Adding..." : "Add Friend"}
                </button>
              )}
              
              {isSelf && (
                <p className="self-note">This is you!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLookup;
