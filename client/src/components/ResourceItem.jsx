import React from 'react';

const ResourceItem = ({ resource }) => {
  return (
    <div className="resource-item">
      <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.title}</a>
    </div>
  );
};

export default ResourceItem;
