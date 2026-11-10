import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookForm from "../components/BookForm";
import BooksAPI from "../services/BooksAPI";

const ManageBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setBooks(await BooksAPI.getMyBooks());
            } catch (err) {
                setError(err.message);
            }
        };
        fetchBooks();
    }, []);

    const handleSaved = (updated) => {
        setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setEditingId(null);
    };

    const handleDelete = async (book) => {
        if (!window.confirm(`Delete "${book.title}"?`)) return;
        try {
            await BooksAPI.deleteBook(book.id);
            setBooks((prev) => prev.filter((b) => b.id !== book.id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <h1>Manage Books</h1>
            <Link to="/">Back to home</Link>
            {error && <p>{error}</p>}

            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        {editingId === book.id ? (
                            <BookForm
                                initialValues={book}
                                submitLabel="Save"
                                onSubmit={(data) => BooksAPI.editBook(book.id, data)}
                                onSuccess={handleSaved}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <>
                                <h3>{book.title}</h3>
                                {book.cover_image && (
                                    <img src={book.cover_image} alt={`Cover of ${book.title}`} />
                                )}
                                <p>{book.author} · {book.status}</p>
                                <button onClick={() => setEditingId(book.id)}>Edit</button>
                                <button onClick={() => handleDelete(book)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ManageBooksPage;