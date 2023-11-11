// ResourceList.jsx
import React from 'react';
import { mockData } from '../../../server/data/mockData'; 
import ResourceItem from '../components/ResourceItem';
import './ResourceList.css';
import Navbar from '../components/Navbar';

const ResourceList = () => {
  
  const groupedResources = mockData.resources.reduce((acc, resource) => {
    const category = resource.category || 'Other';
    acc[category] = [...(acc[category] || []), resource];
    return acc;
  }, {});

  return (
    <div>
          <Navbar />
    <div className="resource-list-container">
      <h2>Resource List</h2>

    
      {Object.entries(groupedResources).map(([category, resourcesInCategory]) => (
        
        
          <div key={category} className="resource-section">
          <h3>{category}</h3>
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
