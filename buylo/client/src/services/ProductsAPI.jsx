import axios from 'axios'
const API_URL = '/api/products' 

const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error(`Error fetching all products from ${API_URL}:`, error);
        throw error;
    }
};



const getProductById = async (id) => {
    try {
       
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
        
    } catch (error) {
        
        console.error(`Error fetching product with id ${id}:`, error);

       
        if (error.response && error.response.status === 404) {
            console.warn(`Product ${id} was not found in the database.`);
        }

        throw error; 
    }
}

const updateProduct = async (id, updatedData) => {

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
        console.error(`Error updating product with id ${id}:`, error);
        throw error;
    }
};

const deleteProduct = async (id) => {
    try {
       
        const response = await axios.delete(`${API_URL}/${id}`);              
        return response.data;
        
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
    }
};

export default {
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}