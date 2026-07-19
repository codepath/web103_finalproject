import { useEffect, useState } from "react";
import { getFollowing } from "../api.js";
import currentUser from "../currentUser.js";
import ArtistCard from "../components/ArtistCard.jsx";

export default function Profile() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFollowing(currentUser.id)
      .then(setFollowing)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h1>My Profile</h1>

      <div className="tabs">
        <span className="tab active">Following</span>
        <span className="tab disabled">Order History</span>
      </div>

      {loading ? (
        <p>Loading your following list...</p>
      ) : following.length === 0 ? (
        <p>You're not following anyone yet.</p>
      ) : (
        <div className="grid">
          {following.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              initialFollowing={true}
              initialNotify={artist.notify_on_release}
              showQuickView={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
