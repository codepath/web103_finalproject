import axios from 'axios';

const API_URL = 'http://localhost:3000/api/income';

const getIncome = async (user_id) => {
    try {
        const response = await axios.get(`${API_URL}/${user_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching income:', error);
        throw error;
    }
};

const getIncomeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching income with id ${id}:`, error);
        throw error;
    }
};

const addIncome = async (incomeData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, incomeData);
        return response.data;
    } catch (error) {
        console.error('Error adding income:', error);
        throw error;
    }
};

const updateIncome = async (id, incomeData) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, incomeData);
        return response.data;
    } catch (error) {
        console.error(`Error updating income with id ${id}:`, error);
        throw error;
    }
};

const deleteIncome = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting income with id ${id}:`, error);
        throw error;
    }
};

const incomeService = {
    getIncome,
    getIncomeById,
    addIncome,
    updateIncome,
    deleteIncome,
};

export default incomeService;