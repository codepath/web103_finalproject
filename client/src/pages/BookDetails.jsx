import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/BookDetails.css'

const BookDetails = ({data, api_url}) => {
    const { id } = useParams();
    const [book, setBook] = useState({ id: 0, name: '', author: '', image: '', description: '' });

    useEffect(() => {
        const fetchBookById = async () => {
            const response = await fetch(`${api_url}/api/books/${id}`)
            const data = await response.json()
            setBook(data)
            console.log(data)
        }
        fetchBookById();
    }, [data, api_url, id]);

    return (
        <>
            <div className="card-details">
                <div className="left-side" style={{ backgroundImage: `url(${book.image})` }}>
                </div>
                <div className="right-side">
                    <h2>{book.name}</h2>
                    <h3>{book.author}</h3>
                    <p>{book.description}</p>
                    <Link to={`/booksreviews/${id}`}><button id="read-reviews-btn">Read Reviews</button></Link>
                    <Link to={`/edit/${id}`}><button id="edit-book-btn">Edit Book</button></Link>
                </div>
            </div>
        </>
    )
}

export default BookDetails
