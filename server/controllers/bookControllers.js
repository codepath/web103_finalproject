import { pool } from "../config/database.js";

const getListBooks = async (req, res) => {
  try {
    const { listId } = req.body;
    const results = await pool.query(`
      SELECT *
      FROM Books
      WHERE list_id = $1
      ORDER BY id ASC
    `, [listId]);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const addBook = async (req, res) => {
  try {

  } catch (error) {
    
  }
};

const editBookInfo = async (req, res) => {
  try {

  } catch (error) {
    
  }
};

const editBookStatus = async (req, res) => {
  try {

  } catch (error) {
    
  }
};

const deleteBook = async (req, res) => {
  try {

  } catch (error) {
    
  }
};

export default { getListBooks, addBook, editBookInfo, editBookStatus, deleteBook };