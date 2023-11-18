import React from 'react';

const Comment = ({ comment, onDelete }) => {
  return (
    <div className="comment">
      <p>{comment.content}</p>
      <button onClick={() => onDelete(comment.id)}>Delete</button>
    </div>
  );
};

export default Comment;
