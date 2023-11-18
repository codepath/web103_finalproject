// postService.js
import axios from 'axios';
import { useApiUrl } from '../contexts/ApiContext';
// const apiUrl = '/api/posts';

export const getAllPosts = async () => {
  const apiUrl = useApiUrl();
  try {
    const response = await axios.get(`${apiUrl}/api/posts`);
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
  const apiUrl = useApiUrl();
  try {
    const response = await axios.delete(`${apiUrl}/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
