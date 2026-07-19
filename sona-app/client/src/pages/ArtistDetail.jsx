import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import currentUser from "../currentUser.js";
import { getArtist, getAdminOf, getFollowing, updateArtist, deleteArtist } from "../api.js";
import FollowButton from "../components/FollowButton.jsx";

function Social({ label, value }) {
  if (!value) return null;
  return <span className="social" title={value}>{label}</span>;
}

const EDITABLE = [
  { key: "name", label: "Name" },
  { key: "genre", label: "Genre" },
  { key: "description", label: "Bio", textarea: true },
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "Twitter" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "spotify", label: "Spotify URL" },
];

export default function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [following, setFollowing] = useState(null);
  const [notify, setNotify] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    getArtist(id).then((data) => {
      setArtist(data);
      const seeded = {};
      for (const { key } of EDITABLE) seeded[key] = data[key] ?? "";
      setForm(seeded);
    });
    getAdminOf(currentUser.id).then((administered) => {
      setIsAdmin(administered?.id === Number(id));
    });
    getFollowing(currentUser.id).then((rows) => {
      const match = rows.find((row) => row.id === Number(id));
      setFollowing(Boolean(match));
      setNotify(match?.notify_on_release ?? false);
    });
  }, [id]);

  if (!artist || following === null) return <p>Loading...</p>;

  async function handleSave(event) {
    event.preventDefault();
    const updated = await updateArtist(id, { ...form, user_id: currentUser.id });
    setArtist((prev) => ({ ...prev, ...updated, ...form }));
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete ${artist.name}?`)) return;
    await deleteArtist(id, currentUser.id);
    navigate("/");
  }

  return (
    <article>
      <div className="detail-hero">
        <img src={artist.photo} alt={artist.name} className="detail-hero-img" />
      </div>

      <div className="detail-titlebar">
        <div>
          <h1>{artist.name}</h1>
          {artist.genre && <span className="genre-tag">{artist.genre}</span>}
        </div>

        <div className="titlebar-actions">
          <FollowButton
            artistId={artist.id}
            initialFollowing={following}
            initialNotify={notify}
          />
          {isAdmin && !editing && (
            <div className="admin-controls">
              <button type="button" onClick={() => setEditing(true)}>Edit</button>
              <button type="button" onClick={handleDelete} className="btn-danger">Delete</button>
            </div>
          )}
        </div>
      </div>

      {isAdmin && editing && (
        <form onSubmit={handleSave} className="edit-form">
          {EDITABLE.map(({ key, label, textarea }) =>
            textarea ? (
              <textarea
                key={key}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={label}
              />
            ) : (
              <input
                key={key}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={label}
              />
            ),
          )}
          <div className="admin-controls">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="detail-grid">
        <div className="detail-about">
          <h2>About</h2>
          <p>{artist.description || "No bio yet."}</p>

          <div className="social-row">
            <Social label="IG" value={artist.instagram} />
            <Social label="X" value={artist.twitter} />
            <Social label="f" value={artist.facebook} />
            <Social label="TT" value={artist.tiktok} />
          </div>

          {artist.spotify ? (
            <a href={artist.spotify} target="_blank" rel="noreferrer" className="spotify-embed">
              Open on Spotify
            </a>
          ) : (
            <div className="spotify-embed">Spotify Embed Placeholder</div>
          )}
        </div>

        <div className="detail-side">
          <h2>Concerts</h2>
          <p className="placeholder">Concerts table — coming soon (Issue 8)</p>
        </div>
      </div>

      <section>
        <h2>Posts</h2>
        <p className="placeholder">Artist posts — coming soon (Issue 4)</p>
      </section>

      <section className="merch-strip">
        <div className="merch-head">
          <h2>Merch</h2>
          <span className="placeholder">See All →</span>
        </div>
        <p className="placeholder">Merch cards — coming soon (Issue 6)</p>
      </section>
    </article>
  );
}
