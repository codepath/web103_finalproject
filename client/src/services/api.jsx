const API_URL = "http://localhost:3000/api"

const addIngredient = async (options) => {
  try {
    const response = await fetch(`${API_URL}/create/ingredient`,options)
    window.location = '/kitchen'
  } catch (err) {
    console.error(err)
  }
}

const editIngredient = async (id, options) => {
  const response = await fetch(`${API_URL}/edit/ingredient`, options)
  const data = await response.json()
  window.location = '/kitchen'
  return data
}

const getIngredients = async () => {
  try {
    const response = await fetch(`${API_URL}/ingredients`)
    const data = await response.json()
    return data
  } catch(err) {
    console.error(err)
  }
}

const getIngredient = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ingredient/${id}`)
    const data = await response.json()
    return data
  } catch(err) {
    console.error(err)
  }
}

const updateIngredient = async (id, options) => {
  try {
    const response = await fetch(`${API_URL}/ingredient/${id}`, options)
    const data = await response.json()
    window.location = '/kitchen'
    return data
  } catch (err) {
    console.error(err)
  }
}

const getRecipes = async () => {
  try {
    const response = await fetch(`${API_URL}/recipes`)
    const data = await response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const getRecipe = async (id) => {
  try {
    const response = await fetch(`${API_URL}/recipe/${id}`)
    const data = await response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const getRecipeIngredients = async (id) => {
  try {
    const response = await fetch(`${API_URL}/recipe/${id}/ingredients`)
    const data = await response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

export default {
  addIngredient,
  getIngredients,
  getIngredient,
  editIngredient,
  updateIngredient,

  getRecipes,
  getRecipe,
  getRecipeIngredients
}
