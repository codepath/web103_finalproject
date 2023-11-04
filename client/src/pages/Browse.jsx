import Book from "../components/Book"

const Browse = (books) => {

    return (
        <>
            
            {books && books.length > 0 ? (
                books.map((book, index) => {
                    <Book book={book}/>
                })
            ) : (<p>No books. Add some!</p>)}
        </>
    )
}

export default Browse 