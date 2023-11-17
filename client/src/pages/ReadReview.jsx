import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../styles/Book.css'
import '../styles/ReadReview.css'

const ReadReviews = ({ user, api_url }) => {
  const { id } = useParams();
  const [book, setBook] = useState({ id: 0, name: '', author: '', image: '', description: '' })
  const [reviews, setReviews] = useState()

  useEffect(() => {
    const fetchBookById = async () => {
      const response = await fetch(`${api_url}/api/books/${id}`)
      const data = await response.json()
      setBook(data);
    }

    const fetchReviews = async () => {
      const response = await fetch(`${api_url}/api/booksreviews/` + id)
      const results = await response.json()
      setReviews(results)
    }
    fetchBookById()
    fetchReviews()
  }, [user, api_url]);


  return (
    <>
      <div className="card-details">
        <div className="left-side" style={{ backgroundImage: `url(${book.image})` }}>
        </div>
        <div className="right-side">
          <h2>{book.name}</h2>
          <h3>{book.author}</h3>
          <p>{book.description}</p>
          <Link to={`/addreview/${id}`}><button>Write a comment...</button></Link>
        </div>
      </div>
      <h3>Book Reviews</h3>
      <div className='reviews-container'>
        {
          reviews && reviews.length > 0 ?
            reviews.map(review =>
              <div key={review.id} className='review'>
                <p>{review.review}</p>
                <p>rating: {review.rating}</p>

                <Link to={`/editreview/${review.id}`}><button>Edit</button></Link>
                <br />
              </div>

            ) :
            <h3>No comments yet. Be the first!</h3>
        }
      </div>
    </>
  )
}

export default ReadReviews
