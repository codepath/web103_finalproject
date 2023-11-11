// postService.js
import axios from 'axios';

const API_URL = '/api/posts';

export const getAllPosts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error); //get
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(API_URL, postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error); //create
    throw error;
  }
};

export const updatePost = async (postId, updatedData) => {
  try {
    const response = await axios.patch(`${API_URL}/${postId}`, updatedData);
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
