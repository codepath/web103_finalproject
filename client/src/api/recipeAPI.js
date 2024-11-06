import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchRecipes(ingredients) {
  const response = await axios.get(`${API_URL}/recipes`, { params: { ingredients } });
  return response.data;
}