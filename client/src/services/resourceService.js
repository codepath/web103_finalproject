import axios from 'axios';

export const getAllResources = async (apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}/api/resources`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const createResource = async (resourceData, apiUrl) => {
  try {
    const response = await axios.post(`${apiUrl}/api/resources`, resourceData);
    return response.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};
