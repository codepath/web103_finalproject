// ResourceList.jsx
import React from 'react';
import { mockData } from '../../../server/data/mockData'; 
import ResourceItem from '../components/ResourceItem';
import '../css/ResourceList.css';  // Import the CSS file

const ResourceList = () => {
  const groupedResources = mockData.resources.reduce((acc, resource) => {
    const category = resource.type || 'Other';
    acc[category] = [...(acc[category] || []), resource];
    return acc;
  }, {});

  return (
    <div>
      
      <div className="resource-list-container">
        <h2>Resource List</h2>

        {/* Display each section */}
        {Object.entries(groupedResources).map(([category, resourcesInCategory]) => (
          <div key={category}>
            <div className="orange-container">
              <h3>{category === 'youtube' ? 'YouTube' : 'Coding Problems'}</h3>
            </div>
            {resourcesInCategory.map(resource => (
              <ResourceItem key={resource.id} resource={resource} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
