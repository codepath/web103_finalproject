const API_URL = "http://localhost:3000/api"

const getScheduledMeals = async () => {
  try {
    const response = await fetch(`${API_URL}/scheduled-meals`, { credentials: 'include' })
    const data = await response.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

const createScheduledMeal = async (meal) => {
  try {
    const response = await fetch(`${API_URL}/create/scheduled-meal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(meal)
    })
    const data = await response.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

const deleteScheduledMeal = async (id) => {
  try {
    const response = await fetch(`${API_URL}/delete/scheduled-meal/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    const data = await response.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

export default {
  getScheduledMeals,
  createScheduledMeal,
  deleteScheduledMeal,
}
