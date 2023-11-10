import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const BookDetails = ({ books }) => {
    const { id } = useParams();
    const [book, setBook] = useState({ id: 0, name: '', author: '', image: '', description: '' });
      
    
    useEffect(() => {
        console.log(id)
        const result = books.find(item => item.id === parseInt(id));
        console.log(result)
    
        if (result) {
            setBook({
                id: parseInt(result.id),
                name: result.name,
                author: result.author,
                image: result.image,
                description: result.description
            });
        } else {
            // Handle the case when the book with the specified id is not found
            console.error(`Book with id ${id} not found`);
        }
    }, [books, id]);
    
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