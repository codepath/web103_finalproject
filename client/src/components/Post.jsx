import React from 'react';

const Post = ({ post, onDelete, onEdit }) => {
  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => onEdit()}>Edit</button> {/* Call the onEdit function */}
      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  );
};

export default Post;
