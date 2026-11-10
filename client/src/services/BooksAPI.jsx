 

//HTTP request: GET /api/books/{id}
const API_URL = "http://localhost:3001/api/books";


const request = async (url, options = {}) => {
    
    const res = await fetch(url, {
        headers: { 'Content-type': "application/json" },
        credentials: "include",
        ...options
    })
    
    if (res.status === 401) {
        window.location.href = "/";
        throw new Error("Your session expired. Please log in again.");
    }
    
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
    }
    
    return data
}

// const getBooks = async (id) => request(`${API_URL}/${id}`)
const getMyBooks = async () => request(API_URL);
const createBook = async (book) => request(API_URL, {
    method: "POST",
    body: JSON.stringify(book),
});

const editBook = async (id, book) => request(`${API_URL}/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(book),
});

const deleteBook = async (id) => request(`${API_URL}/${id}`, {
    method: "DELETE",
})

export default { getMyBooks, createBook, editBook, deleteBook };