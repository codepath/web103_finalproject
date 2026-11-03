 

//HTTP request: GET /api/books/{id}
const request = async (url, options = {}) => {
    
    const res = await fetch(url, {
        headers: { 'Content-type': "application/json" },
        ...options
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
    }

    return data
}

const getBooks = async (id) => request(`http://localhost:3002/api/books/${id}`)

export default { getBooks };