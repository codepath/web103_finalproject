import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createResource } from '../services/resourceService';

const CreateResource = () => {
  const [resource, setResource] = useState({ title: '', link: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createResource(resource);
      navigate('/resources');
    } catch (error) {
      console.error('Failed to create resource:', error);
    }
  };

  return (
    <div>
      <h2>Add Resource</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={resource.title}
          onChange={(e) => setResource({ ...resource, title: e.target.value })}
          placeholder="Title"
          required
        />
        <input
          type="url"
          value={resource.link}
          onChange={(e) => setResource({ ...resource, link: e.target.value })}
          placeholder="Resource Link"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateResource;
