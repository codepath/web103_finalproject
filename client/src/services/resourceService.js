// resourceService.js
import axios from 'axios';
import { useApiUrl } from '../contexts/ApiContext';
// const apiUrl = '/api/resources';

export const getAllResources = async () => {
  const apiUrl = useApiUrl();
  try {
    const response = await axios.get(`${apiUrl}/api/resources`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const createResource = async (resourceData) => {
  const apiUrl = useApiUrl();
  try {
    const response = await axios.post(apiUrl, resourceData);
    return response.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

// Add other service functions for update and delete operations as needed
