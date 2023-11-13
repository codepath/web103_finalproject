import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
function Results() {

  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('http://localhost:3000/questions', {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'GET'
      })
      const data = await result.json()
      setJobs(data)
      console.log(data)
    }
    fetchData()


  }, [])

  return (
    <div>
      <h2>Results</h2>
      {!jobs && <p>Loading...</p>}

      {
        jobs && jobs.map((job, index) => (
          
          <Link to={`/results/${job.id}`}>
            <Card style={{ height: '', width: '18rem' }}>
            <Card.Body>
              <Card.Title>{job.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{job.role}</Card.Subtitle>
              <Card.Text style={{overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap'}} >
                {job.qualifications}
              </Card.Text>
              <Card.Link href="#">Edit</Card.Link>
              <Card.Link href="#">Delete</Card.Link>
            </Card.Body>
            </Card>
          </Link>
      
      ))}
    </div>
  )
}

export default Results