// ResourceItem.jsx
import React from 'react';
import axios from 'axios';

const ResourceItem = ({ resource, shareUserId }) => {
  // Function to handle sharing
  const handleShare = async () => {
    try {
      await axios.post('/api/resources/share', { userId: shareUserId, resourceId: resource.id });
      alert('Resource shared successfully');
    } catch (error) {
      console.error('Error sharing resource:', error);
      alert('Failed to share resource');
    }
  };

  return (
    <div className="resource-item">
      <h4>{resource.title}</h4>
      <p>Link: <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.link}</a></p>
      <button onClick={handleShare}>Share</button>
    </div>
  );
};

export default ResourceItem;
