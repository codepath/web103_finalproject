const API_URL = "http://localhost:3000/api"

const createFavorite = async (recipe_id) => {
  try {
    const response = await fetch(`${API_URL}/create/favorite`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipe_id: recipe_id
      }),
    })
    console.log('creating favorite ...')
    const data = await response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const getFavorites = async () => {
  try {
    const result = await fetch(`${API_URL}/favorites`, { credentials: 'include' })
    const data = await result.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const deleteFavorite = async (id) => {
  try {
    console.log(id)
    const response = await fetch(`${API_URL}/delete/favorite/${id}`, {
      method: "DELETE",
      credentials: 'include',
    })
    const data = await response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

export default {
  createFavorite,
  getFavorites,
  deleteFavorite,
}
