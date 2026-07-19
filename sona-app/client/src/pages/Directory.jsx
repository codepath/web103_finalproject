import { useEffect, useState } from "react";
import { getArtists, getFollowing } from "../api.js";
import currentUser from "../currentUser.js";
import ArtistCard from "../components/ArtistCard.jsx";
import QuickViewPanel from "../components/QuickViewPanel.jsx";

const GENRES = ["Pop", "Rock", "Hip-Hop"];

export default function Directory() {
  const [artists, setArtists] = useState([]);
  const [followMap, setFollowMap] = useState({});
  const [followLoaded, setFollowLoaded] = useState(false);
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    setLoading(true);
    getArtists({ q, genre })
      .then(setArtists)
      .finally(() => setLoading(false));
  }, [q, genre]);

  useEffect(() => {
    getFollowing(currentUser.id).then((rows) => {
      const map = {};
      for (const row of rows) {
        map[row.id] = { following: true, notify: row.notify_on_release };
      }
      setFollowMap(map);
      setFollowLoaded(true);
    });
  }, []);

  const ready = !loading && followLoaded;

  return (
    <section>
      <h1>Discover Artists</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search Bar"
          value={q}
          onChange={(event) => setQ(event.target.value)}
        />
        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="">Genre Dropdown</option>
          {GENRES.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {!ready ? (
        <p>Loading...</p>
      ) : artists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <div className="grid">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onQuickView={() => setSelectedArtist(artist)}
              initialFollowing={followMap[artist.id]?.following ?? false}
              initialNotify={followMap[artist.id]?.notify ?? false}
            />
          ))}
        </div>
      )}
      
      <QuickViewPanel
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />
    </section>
  );
}
