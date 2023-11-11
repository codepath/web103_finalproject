import React, { useState } from 'react';
import { updatePost } from '../services/postService';

const EditPost = ({ post, onSave }) => {
  const [editedPost, setEditedPost] = useState(post);

  const handleContentChange = (e) => {
    setEditedPost({ ...editedPost, content: e.target.value });
  };

  const handleSave = async () => {
    try {
      console.log('Save button clicked');
      await updatePost(editedPost.id, editedPost);
      onSave(editedPost);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };
  

  return (
    <div>
      <h2>Edit Post</h2>
      <textarea
        value={editedPost.content}
        onChange={handleContentChange}
        placeholder="Edit the content"
        required
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditPost;
