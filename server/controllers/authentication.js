import { pool } from '../config/database.js'


// check if a userName exists
const userNameExists = async (req, res) => {
    try {
      const { username } = req.body
      const results = await pool.query(
        `SELECT users.email FROM users WHERE users.email = ${1}`,
         [username]
        )
        if (results.rows.length > 0){
            res.status(200).json({ message: 'Username exists' })
        }
        else {
           res.status(400).json({ message: 'Username does not exist' });
        }
    } catch (error) {
      res.status(400).json( { error: error.message } )
    }
  }

// check if the given password matches the given username's password
const passwordAccuracy = async (req, res) => {
    try {
      const { username, password } = req.body
      const results = await pool.query(
        `SELECT users.password FROM users WHERE users.email = ${1}`,
         [username]
        )
        if (results.rows === password){ // double check this code
            res.status(200).json({ message: 'Password is correct' })
        }
        else {
           res.status(400).json({ message: 'Password does not exist' });
        }
    } catch (error) {
      res.status(400).json( { error: error.message } )
    }
  }


  export default{
    userNameExists,
    passwordAccuracy
  }

