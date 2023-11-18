// commentService.js
import axios from 'axios';

// const API_URL = '/api/comments';
const API_URL = process.env.NODE_ENV === 'production' ? 'https://codefm-production.up.railway.app' : 'http://localhost:3001';


export const getAllComments = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const response = await axios.post(API_URL, commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Add other service functions for update and delete operations as needed
