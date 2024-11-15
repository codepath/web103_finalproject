const API_BASE_URL = 'http://localhost:3001' // Updated base URL with /api prefix

export const registerUser = async (user) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error(`Error registering user: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}
