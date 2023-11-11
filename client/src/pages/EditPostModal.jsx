import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const EditPostModal = ({ post, onSave, onRequestClose }) => {
  const [editedContent, setEditedContent] = useState(post.content);

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSave = () => {
    onSave(post.id, editedContent);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onRequestClose}
      contentLabel="Edit Post"
    >
      <h2>Edit Post</h2>
      <textarea
        value={editedContent}
        onChange={handleContentChange}
        placeholder="Edit the content"
        required
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default EditPostModal;
