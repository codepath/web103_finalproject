import { pool } from "../config/database.js";

const createReview = async (req, res) => {
  try {
    const productid = parseInt(req.params.productid);
    const { userid, rating, reviewtext, reviewdate } = req.body;

    const results = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, review_text, review_date)
      VALUES($1, $2, $3, $4, $5) 
      RETURNING *`,
      [productid, userid, rating, reviewtext, reviewdate]
    );
    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM reviews ORDER BY reviewid ASC"
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const productid = parseInt(req.params.productid);
    const results = await pool.query(
      "SELECT * FROM reviews WHERE product_id = $1",
      [productid]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewid = parseInt(req.params.reviewid);
    const { rating, reviewtext, reviewdate } = req.body;
    const results = await pool.query(
      `UPDATE reviews
      SET rating = $1, review_text = $2, review_date = $3
      WHERE review_id = $4`,
      [rating, reviewtext, reviewdate, reviewid]
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewid = parseInt(req.params.reviewid);
    const results = await pool.query(
      "DELETE FROM reviews WHERE review_id = $1",
      [reviewid]
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  getReviews,
  getProductReviews,
  createReview,
  deleteReview,
  updateReview,
};
