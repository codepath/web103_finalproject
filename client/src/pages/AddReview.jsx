import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/Book.css'

const AddReview = () => {
    const {book_id} = useParams();
    const [review, setReview] = useState({review: "", rating: 0})

    const handleChange = (event) => {
        const {name, value} = event.target;
        setReview( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const create_review = async (event) => {
        event.preventDefault();

        const add_review = async() => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review)
            }
            
            const response = await fetch(`http://localhost:3001/api/reviews/${book_id}`, options)
            const data = await response.json()
            setReview(data)
            return data.id
        }

        const createBooksReviews = async(review_id) => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({book_id: book_id, review_id: review_id})
            }
            const response = await fetch(`http://localhost:3001/api/booksreviews/${book_id}`, options)
            const data = await response.json()
            return data
        }

        const reviewId = await add_review()
        await createBooksReviews(reviewId)
        window.location = `/browse/`
    }

    return (
        <div>
            <center><h3> Leave Your Comments</h3></center>
            <form>
                <label>Rating</label> <br />
                <input type="number" id="rating" name="rating" value={review.rating} onChange={handleChange} /><br />
                <br/>

                <label>Review</label><br />
                <textarea rows="5" cols="50" id="review" name="review" value={review.review} onChange={handleChange}>
                </textarea>
                <br/>

                <button type="submit" value="Submit" onClick={create_review}>Submit</button>
            </form>
        </div>
    )
}

export default AddReview