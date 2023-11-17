// postService.js
import axios from 'axios';

// const API_URL = '/api/posts';
const API_URL = process.env.NODE_ENV === 'production' ? 'https://codefm-client-production.up.railway.app' : 'http://localhost:3001';


export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error); //get
    throw error;
  }
};


export const createPost = async (postData) => {
  try {
    const response = await axios.post('/api/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error); //create
    throw error;
  }
};


export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`/api/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
