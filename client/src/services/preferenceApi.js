const API_URL = "http://localhost:3000/api"

const getPreferences = async () => {
  try {
    const result = await fetch(`${API_URL}/preferences`, { credentials: 'include' })
    const data = result.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const createPreference = async (preference) => {
  try {
    const result = await fetch(`${API_URL}/create/preference`, { 
      method: 'POST',
      credentials: 'include' ,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference)
    }
    )
    const data = await result.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const deletePreference = async (id) => {
  try {
    const response = await fetch(`${API_URL}/delete/preference/${id}`, {
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
  getPreferences,
  createPreference, 
  deletePreference
}
