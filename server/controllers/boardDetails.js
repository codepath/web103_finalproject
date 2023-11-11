import { pool } from '../config/database.js'

// get board information
const getBoardByBoardId = async (req, res) => {
    try {
      const id = req.params.board_id
      const selectQuery = `
      SELECT boards.*
      FROM boards
      WHERE boards.board_id = ${id};
      `
      const results = await pool.query(selectQuery)
      res.status(200).json(results.rows)
    } catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

// get board associated users (all the users associated with a board)
const getUsersByBoardId = async (req, res) => {
    try {
      const id = req.params.board_id
      const selectQuery = `
      SELECT users.*
      FROM users
      LEFT JOIN board_members ON users.user_id = board_members.board_member_id
      LEFT JOIN boards ON board_members.board_id = boards.board_id
      WHERE boards.board_id = ${id}
      
      UNION
      
      SELECT users.*
      FROM users
      JOIN boards ON users.user_id = boards.board_owner_id
      WHERE boards.board_id = ${id};
      `
      const results = await pool.query(selectQuery)
      res.status(200).json(results.rows)
    } catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

// get board associated tasks (all the tasks associated with a board)
const getTasksByBoardId = async (req, res) => {
    try {
      const id = req.params.board_id
      const selectQuery = `
      SELECT tasks.*
        FROM tasks
        WHERE tasks.board_id = ${id};
      `
      const results = await pool.query(selectQuery)
      res.status(200).json(results.rows)
    } catch (error) {
      res.status(409).json( { error: error.message } )
    }
  }

  // add user to a board

  // delete user from board

  // create new board

export default{
    getBoardByBoardId,
    getUsersByBoardId,
    getTasksByBoardId
}