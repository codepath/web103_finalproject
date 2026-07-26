import { Link, useNavigate } from "react-router-dom";
import currentUser from "../currentUser.js";
import { deletePost } from "../api.js";

export default function ArtistPost({ postDetails, isAdmin }) {
  const pubDate = new Date(postDetails.posted_on);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    pubDate,
  );
  const navigate = useNavigate();

  async function handleDelete() {
    if (!confirm(`Delete post?`)) return;
    await deletePost(postDetails.post_id, currentUser.id, postDetails.artist_id);
    navigate(0);
  }

  return (
    <div className="card post">
      <p className="post-date">{formattedDate}</p>
      <p>{postDetails.content}</p>
      {isAdmin && (
        <div className="admin-controls">
          <Link
            role="button"
            className="btn"
            to={`/posts/edit/${postDetails.id}`}
          >
            Edit
          </Link>
          <button
            className="btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
