import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Book.css'

const EditReview = ({data, api_url}) => {
    const {review_id} = useParams();
    // console.log("editreview:"+id)
    const [review, setReview] = useState({id:0, review:'', rating:0, book_id:0});

    useEffect(() => {
        const fetchReview = async () => {
            try {
            const response = await fetch(`${api_url}/api/reviews/` + review_id);
            const data = await response.json();
            setReview(data);
            } catch (error) {
            console.error("Error fetching review:", error);
            }
        }
    
        fetchReview();
    }, [data, api_url])


    const handleChange = (event) => {
        const {name, value} = event.target;
        setReview( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    

    const updateReview = async (event) => {
        event.preventDefault();

        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        }
        
        await fetch(`${api_url}/api/reviews/` + review_id, options)
        window.location.href = `/booksreviews/${review.book_id}`
    }


    const deleteReview = async (event) => {
        event.preventDefault();

        const options = {
            method: 'DELETE'
        }
        
        await fetch(`${api_url}/api/reviews/`+ review_id, options)
        window.location.href = `/booksreviews/${review.book_id}`

    }

    return (
        <div>
            <center><h3>Edit Your Comments</h3></center>
            <form>
                <label>Rating</label> <br />
                <input type="number" id="rating" name="rating" value={review.rating} onChange={handleChange} /><br />
                <br/>

                <label>Review</label><br />
                <textarea rows="5" cols="50" id="review" name="review" value={review.review} onChange={handleChange}>
                </textarea>
                <br/>

                <button type="submit" value="Submit" onClick={updateReview}>update</button>

                <button type="submit" value="Submit" onClick={deleteReview}>delete</button>
            </form>
        </div>
    )
}

export default EditReview
