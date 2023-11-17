// resourceService.js
import axios from 'axios';

// const API_URL = '/api/resources';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://codefm-server-production.up.railway.app' : 'http://localhost:3001';

export const getAllResources = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/resources`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const createResource = async (resourceData) => {
  try {
    const response = await axios.post(API_URL, resourceData);
    return response.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

// Add other service functions for update and delete operations as needed
