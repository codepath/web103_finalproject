import { pool } from "../config/database.js";

// Checks ownership of expense by joining expenses by trip_id since userid is not stored in expenses table. 
const getOwnedExpenses = async (expenseId, userId) => {
  const { rows } = await pool.query (
    `SELECT expenses.*
     FROM expenses
     JOIN trips ON expenses.trip_id = trips.id
     WHERE expenses.id = $1 AND trips.user_id = $2`,
    [expenseId, userId],
  );
  return rows[0] ?? null;
};

export { getOwnedExpenses };
