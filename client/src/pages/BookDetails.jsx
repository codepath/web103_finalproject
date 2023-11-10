import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState({ id: 0, name: '', author: '', image: '', description: '' });
      
    useEffect(() => {
        const fetchBookById = async () => {
            const response = await fetch(`http://localhost:3001/api/books/${id}`)  // http://localhost:3001/api/books/1
            const data = await response.json()
            setBook(data)
            console.log(data)
        }
        fetchBookById();
    }, [id]);
    
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
            <Link to=""><button>Add to MyProfile</button></Link>
        </>
    )
}

export default BookDetails