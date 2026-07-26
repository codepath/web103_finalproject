import { useState, useEffect } from "react";
import { createPost, getArtist } from "../api.js";
import { useSearchParams, useNavigate } from "react-router-dom";
import currentUser from "../currentUser.js";

export default function PostCreateForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState("");
  const [artist, setArtist] = useState({});
  const [error, setError] = useState("");

  const artistId = searchParams.get("artist");

  useEffect(() => {
    getArtist(artistId).then(setArtist);
  }, [artistId]);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setError("Post can't be empty.");
      return;
    }
    try {
      await createPost(currentUser.id, artistId, content);
      navigate(`/artists/${artistId}?new_post=true`);
    } catch (err) {
      setError("Something went wrong. You don't have permission to post here.");
    }
  };

  return (
    <div>
      <div className="detail-titlebar">
        <h1>{artist.name}</h1>
      </div>
      <h2>Create New Post</h2>
      {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="edit-form">
        <textarea
          name="content"
          placeholder="Text for new post"
          id="content"
          value={content}
          onChange={handleChange}
        ></textarea>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
