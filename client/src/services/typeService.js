// typeService.js
import axios from 'axios';

// const API_URL = '/api/types';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://codefm-production.up.railway.app' : 'http://localhost:3001';

export const getAllTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export const createType = async (typeData) => {
  try {
    const response = await axios.post(API_URL, typeData);
    return response.data;
  } catch (error) {
    console.error('Error creating type:', error);
    throw error;
  }
};

// Add other service functions for update and delete operations as needed
