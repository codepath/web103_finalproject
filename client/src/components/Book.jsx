import { Link } from "react-router-dom"
import "../styles/Book.css"

const Book = ({ book }) => {
    console.log(book.name + ", " + book.id)
    return (
        <>
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
            <Link to={`/book/details/${book.id}`}><button>See More</button></Link>

        </>
    )
}

export default Book