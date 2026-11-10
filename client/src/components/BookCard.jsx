import "./BookCard.css"

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

export default function BookCard({ book }) {



    return (
        <article className="book-card">
            <div className="book-card-image">{book.cover_image ? (
                <img src={book.cover_image} alt={`Cover of ${book.title}`} />
            ) : (
                <div className="book-card-placeholder">No cover</div>
            )}
            </div>

            <div className="book-card-details">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Genre: {book.genre}</p>
                <p>Year: {book.year}</p>
                <p>Status: {book.status}</p>
                <p>Progress: {book.current_page ?? 0} / {book.page_count ?? "?"} pages</p>
                <p>Added: {formatDate(book.timestamp)}</p>
                <p>Last updated: {formatDate(book.last_updated)}</p>
            </div>


        </article>
    )
}