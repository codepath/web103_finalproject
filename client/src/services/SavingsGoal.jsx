import axios from 'axios';

const API_URL = 'http://localhost:3000/api/goal';

const getGoals = async (user_id) => {
    try {
        const response = await axios.get(`${API_URL}/${user_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching goals:', error);
        throw error;
    }
};

const addGoal = async (goalData) => {
    try {
        const response = await axios.post(`${API_URL}`, goalData);
        return response.data;
    } catch (error) {
        console.error('Error adding goal:', error);
        throw error;
    }
};

const updateGoal = async (id, goalData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, goalData);
        return response.data;
    } catch (error) {
        console.error(`Error updating goal with id ${id}:`, error);
        throw error;
    }
};

const deleteGoal = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting goal with id ${id}:`, error);
        throw error;
    }
};

const goalService = {
    getGoals,
    addGoal,
    updateGoal,
    deleteGoal,
};

export default goalService;