import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'

function Login() {


  return (    
    <div>
      <h1 className='mb-5'>InterviewAI</h1>
      <Stack direction='horizontal' gap={3} className='d-flex justify-content-center'>
        <Link to='/form'><Button size='md' variant='outline-light'>Get Started</Button></Link>
        <Link to='/result'><Button size='md' variant='outline-light'>Results</Button></Link>
      </Stack>
      </div>
  )
}

export default Login