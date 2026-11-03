import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import BooksAPI from "../services/BooksAPI"



const HomePage = () => {

    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    const { id } = useParams()

    useEffect(() => {

        if (!id) return;

        const fetchData = async () => {
            try {
                const listOfBooks = await BooksAPI.getBooks(id);
                setBooks(listOfBooks);
            } catch (error) {
                setError(error)
            }
        }
        fetchData();
    }, [id])


    return (
        <>
            <h1>Home Page</h1>

            {error && <p>{error.message}</p>}

            {id && (
                <>
                    <h2>List of books you currently have:</h2>
                    <ul>
                        {books.map((book) => (
                            <li key={book.id}>
                                {book.cover_image && (
                                    <img src={book.cover_image} alt={`Cover of ${book.title}`} />
                                )}

                                <h3>{book.title}</h3>
                                <p>Author: {book.author}</p>
                                <p>Genre: {book.genre}</p>
                                <p>Year: {book.year}</p>
                                <p>Status: {book.status}</p>
                                <p>Progress: {book.current_page} / {book.page_count} pages</p>
                                <p>Added: {new Date(book.timestamp).toLocaleDateString()}</p>
                                <p>Last updated: {new Date(book.last_updated).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}

        </>
    )
}


export default HomePage;