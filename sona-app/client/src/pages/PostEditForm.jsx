import { useState, useEffect } from "react";
import { getPost, updatePost } from "../api.js";
import { useParams, useNavigate } from "react-router-dom";
import currentUser from "../currentUser.js";

export default function PostEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState({
    id: 0,
    artist_name: "",
    artist_id: 0,
    content: "",
    posted_on: null,
  });

  useEffect(() => {
    getPost(id).then(setPost);
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updatePost(id, currentUser.id, post.artist_id, post.content);
    navigate(`/artists/${post.artist_id}`);
  };

  return (
    <div>
      <div className="detail-titlebar">
        <h1>{post.artist_name}</h1>
      </div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <textarea
          name="content"
          placeholder="Text for new post"
          id="content"
          value={post.content}
          onChange={handleChange}
        ></textarea>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
