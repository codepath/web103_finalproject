import React from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'


function FormSubmission() {

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(e) 

    const jobTitle = e.target.jobTitle.value
    const jobRole = e.target.jobRole.value
    const jobReq = e.target.jobReq.value
    const jobQual = e.target.jobQual.value
    const technical = e.target.jobTechCheck.checked
    const behavioral = e.target.jobBehaCheck.checked
    
    console.log(jobTitle, jobRole, jobReq, jobQual, technical, behavioral)


    const result = await fetch('http://localhost:3000/openai-api', {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        jobTitle,
        jobRole,
        jobReq,
        jobQual,
        technical,
        behavioral
      })
    })

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`)
    }

    const data = await result.json()

    const interviewQuestions = data.choices[0].message.content // this is the generated interview text from the API Robert, u can play w this info

    console.log(interviewQuestions);
    }

  return (
    <Container className='center-container'>
      <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3" controlId="jobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control type="text" placeholder="Enter job title" />
            {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
          </Form.Group>
          
          
          <Form.Group className="mb-3" controlId="jobRole">
            <Form.Label>Role</Form.Label>
            <Form.Control type="text" placeholder="Enter role" />
          </Form.Group>

          <Form.Group className='mb-3' controlId='jobReq'>
            <Form.Label>Requirements</Form.Label>
            <Form.Control as="textarea" placeholder="Enter requirements" />
          </Form.Group>
          
          <Form.Group className='mb-3' controlId='jobQual'>
            <Form.Label>Qualifications</Form.Label>
            <Form.Control as='textarea' placeholder="Enter qualifications" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobTechCheck">
            <Form.Check type="checkbox" label="Technical" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="jobBehaCheck">
            <Form.Check type="checkbox" label="Behavioral" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
      </Form>

    </Container>
  )
}

export default FormSubmission