import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CreateComment.css'

const CreateComment = () => {

    const [comment, setComment] = useState({comment: "" })
    const {sneaker_id} = useParams();


    const handleChange = (event) => {
        const {name, value} = event.target;
        setComment( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const createComment = async (event) => {
        event.preventDefault();

        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        }
        
        await fetch('/api/reviews/' + sneaker_id, options)
        window.location.href = '/'
    }

    return (
        <div>
            <form>
                <label>💬 Leave a Comment </label> <br />
                <input type="text" id="comment" name="comment" value={comment.comment} onChange={handleChange}/><br />
                <br/>

                {/* <label>Comment ID</label><br />
                <input type="number" id="sneaker_id" name="sneaker_id" value={sneaker_id} readOnly/><br />
                <br/> */}

                <input type="submit" value="Submit" className="submit-button" onClick={createComment} />
            </form>
        </div>
    )
}

export default CreateComment



