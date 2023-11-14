import React, {useState} from 'react';
import './CommentBtn.css'

const CommentBtn = (props) =>  {

  const [num_votes, setNumVotes] = useState(props.num_votes)

  const updateCount = () => {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({num_votes: num_votes + 1})
    }
    
    fetch('/api/reviews/' + props.id, options)
    setNumVotes((num_votes) => num_votes + 1)
  }

  return (
    <button className='commentBtn' id={props.id} onClick={updateCount}>
       {num_votes  +  ' ❤️ ' } <br/ > <br/ >  {props.reviews} 
    </button>
  )

}

export default CommentBtn;

