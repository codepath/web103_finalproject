import axios from 'axios'
const API_URL = '/api/users' 

const getUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error(`Error fetching all users from ${API_URL}:`, error);
        throw error;
    }
};

const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
}

const loginUser = async (credentials) => {
    try {
    //   credentials = { email: '...', password: '...' }
      console.log(credentials)
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      // If successful, the backend returns { token: "..." }
      return response.data; 
    } catch (error) {
      console.error("Login service error:", error.response?.data || error.message);
      throw error; // Pass the error to the component to show an alert
    }
  }

const createUser = async (userData) => {
   
    try {
         console.log( userData)
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}


const updateUser = async (id, updatedData) => {

    try {
        if (!updatedData || Object.keys(updatedData).length === 0) {
            throw new Error('No update data provided');
        }
        const response = await axios.put(`${API_URL}/${id}`, updatedData,{
            headers: {
                'Content-Type': 'application/json'
            }
        });     
        return response.data;
        
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
       
        const response = await axios.delete(`${API_URL}/${id}`);              
        return response.data;
        
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }
};

export default {
    getUsers,
    getUserProfile,
    loginUser,
    createUser,
    updateUser,
    deleteUser
}