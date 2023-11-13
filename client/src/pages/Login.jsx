import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'


function Login() {


  return (    
    <div>
      <h1 className='mb-5'>InterviewAI</h1>
        <Link to='/form'><Button variant='dark'>Get Started</Button></Link>
    </div>
  )
}

export default Login