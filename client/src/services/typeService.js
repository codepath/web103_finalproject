// typeService.js
import axios from 'axios';
import { useApiUrl } from '../contexts/ApiContext';
// const apiUrl = '/api/types';

export const getAllTypes = async () => {
  const apiUrl = useApiUrl();
  try {
    const response = await axios.get(`${apiUrl}/api/types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export const createType = async (typeData) => {
  const apiUrl = useApiUrl();
  try {
    const response = await axios.post(apiUrl, typeData);
    return response.data;
  } catch (error) {
    console.error('Error creating type:', error);
    throw error;
  }
};

// Add other service functions for update and delete operations as needed
