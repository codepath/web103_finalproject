const API_BASE_URL = import.meta.env.VITE_API_URL

/**
 * @description helper function to make requests to the server
 * @param endpoint 
 * @param options 
 * @returns Server response data
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {

  // dynamically make requests to the server, store returned response
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // includes website saved cookies in the request, *refresh token*
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  // parse the response as JSON, store in data variable
  const data = await response.json()

  // if the response is not ok, throw an error with the message included from the server
  // or a generic error message
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred')
  }

  return data
}