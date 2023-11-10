import { pool } from '../config/database.js'

// get user information
const getUserByUserId = async (req, res) => {
    try {
      const id = req.params.user_id
      const selectQuery = `
      SELECT users.*
      FROM users
      WHERE users.user_id = ${id};
      `
      const results = await pool.query(selectQuery)
      res.status(200).json(results.rows)
    } catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

// get user associated boards
const getBoardsByUserId = async (req, res) => {
    try {
      const id = req.params.user_id
      const selectQuery = `
      SELECT boards.*
      FROM boards
      JOIN board_members ON boards.board_id = board_members.board_id
      JOIN users ON board_members.board_member_id = users.user_id
      WHERE users.user_id = ${id} OR boards.board_owner_id = ${id};
      `
      const results = await pool.query(selectQuery)
      res.status(200).json(results.rows)
    } catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

// get user associated tasks
const getTasksByUserId = async (req, res) => {
    try {
      const id = req.params.user_id

      const selectQuery = `
      SELECT tasks.*
        FROM tasks
        WHERE tasks.task_assignee_id = ${id};
      `
      const results = await pool.query(selectQuery)
      res.status(200).json(results.rows)
    } catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

export default{
    getUserByUserId,
    getBoardsByUserId,
    getTasksByUserId
}

