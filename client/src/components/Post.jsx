// Post.js
import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post, onDelete, onEdit }) => {
  return (
    <div className="post">
      <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
      <p>{post.content}</p>
      <button onClick={() => onEdit(post.id)}>Edit</button>
      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  );
};

export default Post;
