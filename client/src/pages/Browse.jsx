import Book from "../components/Book"
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'

const Browse = (props) => {
    const [books, setBooks] = useState([]);
    const [searchBook, setSearchBook] = useState("");

    const handleSearch = (e) => {
        setSearchBook(e.target.value);
    };

    useEffect(() => {
        setBooks(props.data)
    }, [props])

    return (
        <>
            <input
                type="text"
                placeholder="Search..."
                value={searchBook}
                onChange={handleSearch}
            />
            <Link to='/book/new'><button>Add Book</button></Link>
            {books && books.length > 0 ? (
                books.map((book) => {
                    return <Book key={book.id} id={book.id} book={book} />
                })
            ) : (<p>No books. Add some!</p>)}
        </>
    )
}

export default Browse 