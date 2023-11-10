import "../styles/Book.css"

const Book = ({ book }) => {
    return (
        <div className="card">
            <div className="left-container" style={{ backgroundImage: `url(${book.image})` }}>
                {/* <img src={book.image} alt="Book Cover" /> */}
            </div>
            <div className="right-container">
                <h2>{book.name}</h2>
                <h3>{book.author}</h3>
                <p>{book.description}</p>
            </div>

        </div>
    )
}

export default Book