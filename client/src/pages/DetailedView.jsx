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
      //console.log('detailed view', data)

    }
    

    fetchData()
  }, [])


  const handleFeedbackRequest = (question) => {

    console.log('feedback requested for question: ', question)
  
  }
  // const [answers, setAnswers] = useState(Array(job?.questionList.length).fill('')); // initialize answers state with an array of empty strings

  // const handleAnswerChange = (index, newAnswer) => {
  //   setAnswers(prevAnswers => {
  //     const newAnswers = [...prevAnswers];
  //     newAnswers[index] = newAnswer;
  //     return newAnswers;
  //   });
  // };


  const renderQuestions = (questionsString) => {
    const questions = questionsString.split(/\d+\./).slice(1); // split by question number pattern and remove the first empty string


    return questions.map((question, index) => (
      
      <Question question={question} index={index}/>
      // <div key={index}>
      //   <p>{`${index + 1}. ${question.trim()}`}</p>
      //   <textarea />
      //   <Button onClick={() => handleFeedbackRequest(question.trim())}>Ask for Feedback</Button>
      // </div>
    ));
  };
  


  return (
    <div>
        {/* <h3>DetailedView</h3> */}

        {job && (
            <>
            {/* <h2>{job.title}</h2>
            <h3>{job.role}</h3>
            <p>{job.qualifications}</p> */}
            {job && renderQuestions(job.qlist)}

            </>
            )
        }

        <Button>Edit</Button><Button>Delete</Button>
    </div>
  )
}

export default DetailedView