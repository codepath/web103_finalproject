import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';


function Question({question, index}) {

    const [answer, setAnswer] = useState('')

    const handleFeedbackRequest = (question, answer) => {
        
        
        console.log('feedback requested for question: ', question)
        console.log('with answer', answer)

        // make the call here
        
      
    }
  
    return (
    <Card direction='vertical' key={index}>
        <Card.Title>{`${index + 1}. ${question.trim()}`}</Card.Title>
        <Card.Body direction='vertical' style={{}}>
            <Form.Control className='mb-3' as='textarea' style={{width: '100%'}}value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <div className='d-flex gap-2'>
                <Button variant='outline-success'>Save</Button>
                <Button variant='outline-primary' className='ml-8' onClick={() => handleFeedbackRequest(question.trim(), answer)}>Ask for Feedback</Button>
            </div>
        </Card.Body>
    </Card>
  )
}

export default Question