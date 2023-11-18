import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post, onDelete, onEdit }) => {
  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(post.id);
    }
  };

  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit(post.id);
    }
  };

  return (
    <div className="post">
      <h3><Link to={`/posts/${post.id}`}>{post.content}</Link></h3>
      <button onClick={() => onEdit()}>Edit</button> {/* Call the onEdit function */}
      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  );
};

export default Post;
