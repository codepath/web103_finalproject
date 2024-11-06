import axios from 'axios';

const SPOONACULAR_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

export const fetchRecipesFromSpoonacular = async (ingredients = [], preferences= '') => {
    try {
        const response = await axios.get(SPOONACULAR_API_URL, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                includeIngredients: ingredients.join(','),
                diet: preferences.join(','),  // Optional: You can specify multiple with comma meaning AND connection. You can specify multiple diets separated with a pipe | meaning OR connection. For example diet=gluten free,vegetarian means the recipes must be both, gluten free and vegetarian. If you specify diet=vegan|vegetarian, it means you want recipes that are vegan OR vegetarian
                number: 10          // Number of recipes to fetch
            }
        });
        return response.data.results;  // Spoonacular returns results in a "results" array
    } catch (error) {
        console.error('Error fetching recipes from Spoonacular:', error);
        throw new Error('Failed to fetch recipes from Spoonacular');
    }
};

export const fetchRecipeByIdFromSpoonacular = async (id) => {
    const spoonacularUrl = `https://api.spoonacular.com/recipes/${id}/information`;

    try {
        const response = await axios.get(spoonacularUrl, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                includeNutrition: false,
                addWinePairing: false,
                addTasteData: false
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching recipe by ID from Spoonacular:', error);

        if (error.response && error.response.status === 404) {
            throw new Error('Recipe not found');
        }

        throw new Error('Failed to fetch recipe by ID from Spoonacular');
    }
};