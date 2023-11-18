import axios from 'axios';

export const getAllTypes = async (apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}/api/types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export const createType = async (typeData, apiUrl) => {
  try {
    const response = await axios.post(`${apiUrl}/api/types`, typeData);
    return response.data;
  } catch (error) {
    console.error('Error creating type:', error);
    throw error;
  }
};
