import axios from 'axios';

const API_URL = 'http://localhost:5000/api/income';

export const getIncome = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching income:', error);
        throw error;
    }
};

export const getIncomeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching income with id ${id}:`, error);
        throw error;
    }
};

export const addIncome = async (incomeData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, incomeData);
        return response.data;
    } catch (error) {
        console.error('Error adding income:', error);
        throw error;
    }
};

export const updateIncome = async (id, incomeData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, incomeData);
        return response.data;
    } catch (error) {
        console.error(`Error updating income with id ${id}:`, error);
        throw error;
    }
};

export const deleteIncome = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting income with id ${id}:`, error);
        throw error;
    }
};