import axios from 'axios';

export const getAllPosts = async (apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}/api/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (postData, apiUrl) => {
  try {
    const response = await axios.post(`${apiUrl}/api/posts`, postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (postId, postData, apiUrl) => {
  try {
    const response = await axios.put(`${apiUrl}/api/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId, apiUrl) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
