// ResourceItem.jsx
import React from 'react';

const ResourceItem = ({ resource }) => {
  return (
    <div className="resource-item">
      <h4>{resource.title}</h4>
      <p>Link: <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.link}</a></p>
      
    </div>
  );
};

export default ResourceItem;
