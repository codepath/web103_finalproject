import { Link } from "react-router-dom"
import "../styles/Book.css"

const Book = ({ book }) => {
    return (
        <>
            <div className="card">
                <div className="left-container" style={{ backgroundImage: `url(${book.image})` }}>
                </div>
                <div className="right-container">
                    <h2>{book.name}</h2>
                    <h3>{book.author}</h3>
                    <p>{book.description}</p>
                    <Link to={`/book/details/${book.id}`}><button id="see-more-btn">See More</button></Link>
                </div>
            </div>
        </>
    )
}

export default Book