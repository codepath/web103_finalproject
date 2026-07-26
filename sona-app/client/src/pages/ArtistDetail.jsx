import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import currentUser from "../currentUser.js";
import {
  getArtist,
  getAdminOf,
  getFollowing,
  updateArtist,
  deleteArtist,
  getPostsByArtist,
  getArtistMerch,
} from "../api.js";
import FollowButton from "../components/FollowButton.jsx";
import ArtistPost from "../components/ArtistPost.jsx";
import MerchCard from "../components/MerchCard.jsx";
import CreateMerchForm from "../components/CreateMerchForm.jsx";
import Toast from "../components/Toast.jsx";

function Social({ label, value }) {
  if (!value) return null;
  return (
    <span className="social" title={value}>
      {label}
    </span>
  );
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
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState("");
  const [merch, setMerch] = useState([]);
  const [merchLoading, setMerchLoading] = useState(true);
  const [showCreateMerch, setShowCreateMerch] = useState(false);

  let new_post = searchParams.get("new_post") === "true";

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

  useEffect(() => {
    getPostsByArtist(id).then(setPosts);
    setMerchLoading(true);
    getArtistMerch(id)
      .then(setMerch)
      .finally(() => setMerchLoading(false));
  }, [id]);

  useEffect(() => {
    if (new_post) {
      showToast("Post published");
      const params = new URLSearchParams(searchParams);
      params.delete("new_post");
      setSearchParams(params, { replace: true });
    }
  }, [new_post, searchParams, setSearchParams]);

  if (!artist || following === null) return <p>Loading...</p>;

  async function handleSave(event) {
    event.preventDefault();
    const updated = await updateArtist(id, {
      ...form,
      user_id: currentUser.id,
    });
    setArtist((prev) => ({ ...prev, ...updated, ...form }));
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete ${artist.name}?`)) return;
    await deleteArtist(id, currentUser.id);
    navigate("/");
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
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
          {!isAdmin && (
            <FollowButton
              artistId={artist.id}
              initialFollowing={following}
              initialNotify={notify}
            />
          )}
          {isAdmin && !editing && (
            <div className="admin-controls">
              <button
                type="button"
                className="btn"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </button>
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
            <button type="submit" className="btn">
              Save
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
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
            <Social label="FB" value={artist.facebook} />
            <Social label="TT" value={artist.tiktok} />
          </div>

          {artist.spotify ? (
            <a
              href={artist.spotify}
              target="_blank"
              rel="noreferrer"
              className="spotify-embed"
            >
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
        <div className="posts-titlebar">
          <h2>Posts</h2>
          {isAdmin && (
            <Link
              className="btn"
              role="button"
              to={`/posts/create?artist=${artist.id}`}
            >
              Create
            </Link>
          )}
        </div>
        <div className="grid">
          {posts.length > 0 ?
            (posts.map((post) => (
              <ArtistPost key={post.id} postDetails={post} isAdmin={isAdmin} />
            ))) :
            (<p className="placeholder">No posts yet.</p>)
          }
        </div>
      </section>

      <section className="merch-strip">
        <div className="merch-head">
          <h2>Merch</h2>
          <Link to="/merch">See All →</Link>
        </div>

        {isAdmin && !showCreateMerch && (
          <button type="button" onClick={() => setShowCreateMerch(true)}>
            Add Merch
          </button>
        )}

        {isAdmin && showCreateMerch && (
          <CreateMerchForm
            artistId={id}
            onCreated={(created) => {
              setMerch((prev) => [created, ...prev]);
              setToast("Merch created!");
              setTimeout(() => setToast(""), 3000);
            }}
          />
        )}

        {merchLoading ? (
          <p>Loading...</p>
        ) : merch.length === 0 ? (
          <p className="placeholder">No merch yet.</p>
        ) : (
          <div className="grid">
            {merch.map((item) => (
              <MerchCard
                key={item.id}
                merch={item}
                isAdmin={isAdmin}
                onUpdated={(updated) => {
                  setMerch((prev) =>
                    prev.map((m) => (m.id === updated.id ? updated : m)),
                  );
                  setToast("Merch updated!");
                  setTimeout(() => setToast(""), 3000);
                }}
                onDeleted={(deletedId) => {
                  setMerch((prev) => prev.filter((m) => m.id !== deletedId));
                }}
              />
            ))}
          </div>
        )}
      </section>

      {toast && <span className="toast">{toast}</span>}
    </article>
  );
}
