import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../styles/Book.css'

const ReadReviews = ({user, api_url}) => {
  const {id} = useParams();
  const [book, setBook] = useState({ id: 0, name: '', author: '', image: '', description: '' })
  const [reviews, setReviews] = useState()

  useEffect(() => {
    const fetchBookById = async () => {
      const response = await fetch(`${api_url}/api/books/${id}`) 
      const data = await response.json()
      setBook(data);
  }

    const fetchReviews = async() => {
      const response = await fetch(`${api_url}/api/booksreviews/`+id)
      const results = await response.json()
      setReviews(results)
    }
    fetchBookById()
    fetchReviews()
}, [user, api_url]);


  return (
    <div className='flex-row'>
      <div className="card">
        <div className="left-container" style={{ backgroundImage: `url(${book.image})` }}>
        </div> 
        <div className="right-container">
            <h2>{book.name}</h2>
            <h3>{book.author}</h3>
            <p>{book.description}</p>
        </div> 
      </div> 
      <br />
      <div>
      {
        reviews && reviews.length > 0 ?
        reviews.map(review => 
          <>
            <h3 key={review.id}>Book Reviews</h3>
            <p>comment: {review.review}</p>
            <p>rating: {review.rating}</p>

            <Link to={`/editreview/${review.id}`}><button>Edit this Comment</button></Link>
            <br />
          </>
          
          ) :
          <h3>No comments yet. Be the first!</h3>
      }
        <Link to={`/addreview/${id}`}><button>Leave a review</button></Link>
      </div>
    </div>
  )
}

export default ReadReviews
