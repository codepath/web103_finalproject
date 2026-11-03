import { pool } from "../config/database.js";

const getListBooks = async (req, res) => {
  try {
    const listId = parseInt(req.params.listId);

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
    const listId = parseInt(req.params.listId);
    const { title, author, genre, year, pageCount, coverImage, status } = req.body;

    await pool.query(`
      INSERT INTO Books (list_id, title, author, genre, year, page_count, cover_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [listId, title, author, genre, year, pageCount, coverImage]);

    res.send(201);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const editBookInfo = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const { title, author, genre, year, pageCount, coverImage, status } = req.body;

    await pool.query(`
      UPDATE Books
      SET title = $1, author = $2, genre = $3, year = $4, page_count = $5, cover_image = $6, status = $7
      WHERE id = $8
    `, [title, author, genre, year, pageCount, coverImage, status, bookId]);

    res.send(200);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const editBookStatus = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const { status, currentPage } = req.body;

    await pool.query(`
      UPDATE Books
      SET status = $1, current_page = $2
      WHERE id = $3
    `, [status, currentPage, bookId]);

    res.send(200);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    await pool.query(`
      DELETE FROM Books
      WHERE id = $1
    `, [bookId]);

    res.send(200);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default { getListBooks, addBook, editBookInfo, editBookStatus, deleteBook };