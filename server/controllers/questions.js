// const { pool } = require('../config/database.js');
import {pool} from '../config/database.js'

const getQuestions = async (req, res) => {
    // update by user
    try {
        const questions = await pool.query('SELECT * FROM questions')
        res.status(200).json(questions.rows)

    } catch (error) {
        res.status(400).json({error: error.message})
        
    }


}

const createQuestion = async (req, res) => {
    try {
        console.log('creating question controller')
        
        // app.post("/openai-api", async (req, res) => {

        console.log("Openai API called");
        console.log("Request Body:", req.body);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.openai_key}`,
          },
          method: "POST",
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are an interview assistant service provider. Your goal is to give sample ${
                  req.body.technical && req.body.behavioral
                    ? "technical and behavioral"
                    : ""
                } ${req.body.technical && !req.body.behavioral ? "technical" : ""} ${
                  !req.body.technical && req.body.behavioral ? "behavioral" : ""
                }interview questions to the user. The user is a ${
                  req.body.title
                } job seeker. The requirements for the job they are applying for are: ${
                  req.body.requirements
                }. The user's own qualifications are: ${req.body.qualifications} `,
              },
              {
                role: "user",
                content: `Given the information about the job and the user, please provide a list of ${
                  req.body.technical && req.body.behavioral
                    ? "technical and behavioral"
                    : ""
                } ${req.body.technical && !req.body.behavioral ? "technical" : ""} ${
                  !req.body.technical && req.body.behavioral ? "behavioral" : ""
                }questions that the user should be prepared for in an interview for a ${
                  req.body.title
                } job.`,
              },
            ],
          }),
        });
        
        console.log('Openai API response received')
        const data = await response.json();
        const qList = data.choices[0].message.content

      // const qList = '1. Can you explain the difference between Java and Python? \n' +
      // '2. How would you handle a situation where you need to optimize a specific algorithm or piece of code? \n' +
      // '3. Have you worked with any cloud technologies like AWS or GCP? If so, can you explain your experience and how you utilized these technologies? \n' +
      // '4. Can you describe a project where you used Spring Boot or Spring Batch? \n' +
      // '5. How would you design and implement a database schema for a financial application? \n' +
      // '6. Can you explain the difference between relational and non-relational databases? \n' +
      // '7. Have you worked with any SQL databases like Postgres, MySQL, or Supabase? If so, what types of queries have you written and what were the outcomes? \n' +
      // '8. Can you explain the principles and benefits of using object-oriented programming? \n' +
      // '9. Have you worked with any front-end technologies like HTML, CSS, or JavaScript? Can you describe a project where you used these technologies? \n' +
      // '10. How would you handle handling and processing large datasets efficiently in a distributed system? \n' +
      // '11. Can you describe your experience in working with version control systems like Git? \n' +
      // '12. Have you participated in any coding competitions or published any technical papers? If so, could you discuss your experience and any notable achievements?'

        try{
          console.log('inserting into questions table')
          const { title, role, requirements, qualifications, technical, behavioral } = req.body
          
          console.log('req.body', req.body)
          //console.log(questionList)

          const results = await pool.query(`
              INSERT INTO questions (title, role, requirements, qualifications, technical, behavioral, qList)
              VALUES($1, $2, $3, $4, $5, $6, $7)
              RETURNING *`, [title, role, requirements, qualifications, technical, behavioral, qList])
          
          res.status(201).json(results.rows[0])
        }
        catch (error){
          console.log(error)
          res.status(409).json({error: error.message})
        }

        console.log('controller done')
    } catch (err) {
      res.status(409).json({err:err.message})
    }
}


const getQuestionById = async (req, res) => {
    try {
        const {id} = req.params
        const question = await pool.query('SELECT * FROM questions WHERE id = $1', [id])
        res.status(200).json(question.rows[0])
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


const updateQuestionAnswer = async (req, res) => {
}

// const updateQuestion = 

// const deleteQuestion = async (req, res) => {

// }

export default {getQuestions, createQuestion, getQuestionById}