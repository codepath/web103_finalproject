import { pool } from "../config/database.js";


const getMyBooks = async (req, res) => {
  try {
    //get every column from the 'books' table only
    const results = await pool.query(`
      SELECT books.*
      FROM books
      JOIN readingLists ON books.list_id = readinglists.id
      WHERE readinglists.user_id = $1
      ORDER BY books.id ASC
      `, [req.user.id]);

    res.status(200).json(results.rows)

  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message})
  }
}

// const getListBooks = async (req, res) => {
//   try {
//     const listId = parseInt(req.params.listId);

//     const results = await pool.query(`
//       SELECT *
//       FROM Books
//       WHERE list_id = $1
//       ORDER BY id ASC
//     `, [listId]);

//     res.status(200).json(results.rows);
//   } catch (error) {
//     res.status(409).json({ error: error.message });
//   }
// };
//

const addBook = async (req, res) => {
  try {

    const { title, author, genre, year, pageCount, coverImage } = req.body;

    const listResult = await pool.query(`SELECT id FROM readinglists WHERE user_id = $1`, [req.user.id])
    if (listResult.rows.length === 0) return res.status(404).json({ error: "Reading list not found" });

    const results = await pool.query(`
      INSERT INTO Books (list_id, title, author, genre, year, page_count, cover_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [listResult.rows[0].id, title, author, genre, year, pageCount, coverImage]);

    res.status(201).json(results.rows[0]);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
};

const editBookInfo = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const { title, author, genre, year, pageCount, coverImage, status } = req.body;

    const results = await pool.query(`
      UPDATE Books
      SET title = $1, author = $2, genre = $3, year = $4, page_count = $5, cover_image = $6, status = $7
      WHERE id = $8
      AND list_id IN (SELECT id FROM readinglists WHERE user_id = $9)
      RETURNING *
    `, [title, author, genre, year, pageCount, coverImage, status, bookId, req.user.id]);

    if (results.rows.length === 0) return res.status(404).json({ error: "Book not found" })
    
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const editBookStatus = async (req, res) => {
//   try {
//     const bookId = parseInt(req.params.bookId);
//     const { status, currentPage } = req.body;

//     await pool.query(`
//       UPDATE Books
//       SET status = $1, current_page = $2
//       WHERE id = $3
//     `, [status, currentPage, bookId]);

//     res.status(200);
//   } catch (error) {
//     res.status(409).json({ error: error.message });
//   }
// };

const deleteBook = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    const results = await pool.query(`
      DELETE FROM Books
      WHERE id = $1
      AND list_id IN (SELECT id FROM readinglists WHERE user_id = $2)
      RETURNING *
    `, [bookId, req.user.id]);

    if (results.rows.length === 0) return res.status(404).json({ error: "Book not found" });

    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { getMyBooks, addBook, editBookInfo, deleteBook };