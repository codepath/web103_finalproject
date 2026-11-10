import { useState, useEffect } from "react"
// import { useParams } from "react-router-dom"
import BooksAPI from "../services/BooksAPI"
import { Link } from "react-router-dom"
import "./HomePage.css"
import BookCard from "../components/BookCard"


const HomePage = () => {

    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    // const { id } = useParams()

    useEffect(() => {

        // if (!id) return;
        const fetchData = async () => {
            try {
                const listOfBooks = await BooksAPI.getMyBooks();
                setBooks(listOfBooks);
            } catch (error) {
                setError(error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <h1>Home Page</h1>

            {error && <p>{error.message}</p>}

            

            <nav className="home-links">
                <Link to="/books/new">Add a book</Link>
                <Link to="/books/manage">Manage Books</Link>
            </nav>

            {books.length === 0 && <p>No books yet. Add your first one!</p>}
            
            <h2>List of books you currently have:</h2>
            <ul className="book-grid">
                {books.map((book) => (
                    <li key={book.id}>
                        <BookCard book={book}/>
                        {/* {book.cover_image && (
                            <img src={book.cover_image} alt={`Cover of ${book.title}`} />
                        )}

                        <h3>{book.title}</h3>
                        <p>Author: {book.author}</p>
                        <p>Genre: {book.genre}</p>
                        <p>Year: {book.year}</p>
                        <p>Status: {book.status}</p>
                        <p>Progress: {book.current_page} / {book.page_count} pages</p>
                        <p>Added: {new Date(book.timestamp).toLocaleDateString()}</p>
                        <p>Last updated: {new Date(book.last_updated).toLocaleDateString()}</p> */}
                    </li>
                ))}
            </ul>


        </>
    )
};


export default HomePage;