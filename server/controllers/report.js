import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// Endpoint to generate dynamic reports
const getReports = async (req, res) => {
//   console.log("req.query", req.query);
  const { user_id, type, year, month } = req.query;

  try {
    if (!user_id || !type || !year || !month) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }

    let query = "";
    let values = [user_id, year, month];

    if (type === "monthly") {
      const startDate = `${year}-${month}-01`;
      let endDate = 11; 
      if (month === "02") {
        endDate = `${year}-${month}-28`;
      } else if (["04", "06", "09", "11"].includes(month)) {
        endDate = `${year}-${month}-30`;
      } else {
        endDate = `${year}-${month}-31`;
      };

      query = `
      SELECT
        DATE_TRUNC('month', date) AS month,
        SUM(amount) AS total,
        'income' AS category
      FROM income
      WHERE user_id = $1 AND date >= $2 AND date <= $3
      GROUP BY month
      UNION ALL
      SELECT
        DATE_TRUNC('month', date) AS month,
        SUM(amount) AS total,
        'expenses' AS category
      FROM expenses
      WHERE user_id = $1 AND date >= $2 AND date <= $3
      GROUP BY month;
    `;

      values = [user_id, startDate, endDate];
    } else if (type === "yearly") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      query = `
      SELECT
        DATE_TRUNC('year', date) AS year,
        SUM(amount) AS total_income
        'income' AS category
      FROM income
      WHERE user_id = $1 AND date >= $2 AND date <= $3
      GROUP BY year
      UNION ALL
      SELECT
        DATE_TRUNC('year', date) AS year,
        SUM(amount) AS total_expenses
        'expenses' AS category
      FROM expenses
      WHERE user_id = $1 AND date >= $2 AND date <= $3
      GROUP BY year;
    `;
      values = [user_id, startDate, endDate];
    } else {
      return res
        .status(400)
        .json({ error: "Invalid report type. Use 'monthly' or 'yearly'." });
    }

    console.log('query', query);
    const result = await pool.query(query, values);
    console.log('result.rows', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error generating dynamic report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getReports };
