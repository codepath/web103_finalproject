import { pool } from "../config/database.js";

// get user information
const getUserByUserId = async (req, res) => {
  try {
    const id = req.params.user_id;
    const selectQuery = `
      SELECT users.*
      FROM users
      WHERE users.user_id = ${id};
      `;
    const results = await pool.query(selectQuery);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// get user associated boards
const getBoardsByUserId = async (req, res) => {
  try {
    const id = req.params.user_id;
    const selectQuery = `
      SELECT boards.*
      FROM boards
      JOIN board_members ON boards.board_id = board_members.board_id
      JOIN users ON board_members.board_member_id = users.user_id
      WHERE users.user_id = ${id} OR boards.board_owner_id = ${id};
      `;
    const results = await pool.query(selectQuery);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// get user associated tasks
const getTasksByUserId = async (req, res) => {
  try {
    const id = req.params.user_id;

    const selectQuery = `
      SELECT tasks.*
        FROM tasks
        WHERE tasks.task_assignee_id = ${id};
      `;
    const results = await pool.query(selectQuery);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// create new user profile
const createUserProfile = async (req, res) => {
  try {
    const { email, name, phoneNum, password } = req.body;
    const results = await pool.query(
      `INSERT INTO users (email, name, phone_number, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, name, phoneNum, password]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const results = await pool.query("Select * from users");
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete user profile

export default {
  getUserByUserId,
  getBoardsByUserId,
  getTasksByUserId,
  createUserProfile,
  getAllUsers,
};
