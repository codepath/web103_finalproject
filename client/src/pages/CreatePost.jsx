import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import { useApiUrl } from '../contexts/ApiContext';
import '../css/CreatePost.css'; 

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '' });
  const navigate = useNavigate();
  const apiUrl = useApiUrl();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createPost(post, apiUrl);
      navigate('/posts');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  

  const handleTitleChange = (e) => {
    setPost({ ...post, title: e.target.value });
  };

  const handleContentChange = (e) => {
    setPost({ ...post, content: e.target.value });
  };

  return (
    <div>
      <h2>Create Post</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Title:</label>
            <input
              type="text"
              value={post.title}
              onChange={handleTitleChange}
              placeholder="Enter the title"
              required
              className="input-field"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Content:</label>
            <textarea
              value={post.content}
              onChange={handleContentChange}
              placeholder="Enter the content"
              required
              className="textarea-field"
            />
          </div>
          <div className="form-field">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
