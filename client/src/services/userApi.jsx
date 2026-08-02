const API_URL = "http://localhost:3000/api"

const getUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`)
    const data = response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

export default {
  getUser
}
