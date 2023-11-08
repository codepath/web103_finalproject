import Book from "../components/Book"
import { useState, useEffect } from "react";

const Browse = (props) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        setBooks(props.data)
    }, [props])

    return (
        <>

            {books && books.length > 0 ? (
                books.map((book) => {
                    return <Book key={book.id} book={book}/>
                })
            ) : (<p>No books. Add some!</p>)}
        </>
    )
}

export default Browse 