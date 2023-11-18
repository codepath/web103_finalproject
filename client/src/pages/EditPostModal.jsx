import React, { useState } from 'react';
import Modal from 'react-modal';
import { useApiUrl } from '../contexts/ApiContext';

Modal.setAppElement('#root');

const EditPostModal = ({ post, onSave, onRequestClose }) => {
    const [editedContent, setEditedContent] = useState(post.content);
    const apiUrl = useApiUrl();

    const handleSave = () => {
        onSave(post.id, editedContent, apiUrl);
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
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Edit the content"
                required
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onRequestClose}>Cancel</button>
        </Modal>
    );
};

export default EditPostModal;
