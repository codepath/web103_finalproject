import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Question from '../components/Question'


function DetailedView() {
    const {id} = useParams()

    const [job, setJob] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:3000/questions/${id}`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'GET'
      })
      const data = await result.json()
      setJob(data)
      console.log('detailed view', data)

    }
    

    fetchData()
  }, [])


  



  const renderQuestions = (questionsString) => {
    const questions = questionsString.split(/\d+\./).slice(1); // split by question number pattern and remove the first empty string


    return questions.map((question, index) => (
      
      <Question question={question} index={index}/>
      
    ));
  };
  


  return (
    <>
    {job && <div>

      <h1>{job.title}</h1>
      <h3>{job.role}</h3>
      <div className='d-flex gap-2 center justify-content-center'>
        <Button size='sm' variant='outline-primary'>Edit</Button>
        <Button size='sm' variant='outline-danger'>Delete</Button>
      </div>
      


      
      <div className='d-flex gap-3 flex-column mt-4'>
        {renderQuestions(job.qlist)}
      </div>

        
    </div>}
    </>
  )
}

export default DetailedView