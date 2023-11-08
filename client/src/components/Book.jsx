const Book = ({ book }) => {
    return (
        <>
            <div className="bookContainer">
                <h2>{book.name}</h2>
                <h3>{book.author}</h3>
                <p>{book.description}</p>
                <img src={book.image} alt="" />
            </div>
        </>
    )
}

export default Book