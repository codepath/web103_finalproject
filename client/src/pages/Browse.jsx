import Book from "../components/Book"
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'

const Browse = (props) => {
    const [books, setBooks] = useState([]);
    const [searchBook, setSearchBook] = useState("");

    useEffect(() => {
        setBooks(props.data)
    }, [props])

    const handleSearch = (e) => {
        let value = e.target.value;
        try {
            let filtered = books.filter( book => {return book.name.toLowerCase().includes(value)})
            setSearchBook(filtered)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <input
                type="text"
                placeholder="Search..."

                onChange={handleSearch}
            />
            <Link to='/book/new'><button>Add Book</button></Link>
            {
                searchBook && searchBook.length > 0 ?
                searchBook.map ((book) => {
                    return <Book key={book.id} id={book.id} book={book} />
                })
                :
                books && books.length > 0 ? (
                books.map((book) => {
                    return <Book key={book.id} id={book.id} book={book} />
                })
            ) : (<p>No books. Add some!</p>)}
        </>
    )
}

export default Browse 