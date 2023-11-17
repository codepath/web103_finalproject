import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'


function Question({question, index}) {

    const [answer, setAnswer] = useState('')

    const handleFeedbackRequest = (question, answer) => {
        
        
        console.log('feedback requested for question: ', question)
        console.log('with answer', answer)

        // make the call here
        
      
    }
  
    return (
    <div key={index}>
        <p>{`${index + 1}. ${question.trim()}`}</p>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <Button onClick={() => handleFeedbackRequest(question.trim(), answer)}>Ask for Feedback</Button>
    </div>
  )
}

export default Question