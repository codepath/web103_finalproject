const Book = (book) => {
    return (
        <>
            <div className="bookContainer">
                {/* <img src={book.imageUrl} alt="" /> */}
                <p>{book.title}</p>
            </div>
        </>
    )
}

export default Book