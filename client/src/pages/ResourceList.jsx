import React, { useEffect, useState } from 'react';
import { getAllResources } from '../services/resourceService';
import ResourceItem from '../components/ResourceItem';

const ResourceList = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      }
    };

    fetchResources();
  }, []);

  return (
    <div>
      <h2>Resource List</h2>
      {resources.map(resource => (
        <ResourceItem key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;
