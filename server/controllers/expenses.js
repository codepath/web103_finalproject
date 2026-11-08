import pool from "../config/database.js";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const EXPENSE_SELECT = `
  SELECT e.id, e.trip_id, e.payer_id, p.name AS payer_name, e.created_by_id, e.description,
         e.amount, e.expense_date, e.created_at, e.updated_at
  FROM expenses e JOIN users p ON p.id = e.payer_id`;

async function isMember(tripId, userId) {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM trip_members WHERE trip_id = $1 AND user_id = $2",
    [tripId, userId],
  );
  return rowCount > 0;
}

async function validateExpense(body, tripId, { partial = false } = {}) {
  const values = {};
  if (body.description !== undefined || !partial) {
    const description = String(body.description ?? "").trim();
    if (!description) return { error: "Description is required." };
    values.description = description.slice(0, 255);
  }
  if (body.amount !== undefined || !partial) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return { error: "Amount must be greater than zero." };
    values.amount = amount;
  }
  if (body.payer_id !== undefined || !partial) {
    const payer = Number(body.payer_id);
    if (!Number.isInteger(payer) || !(await isMember(tripId, payer))) {
      return { error: "The payer must be a member of this trip." };
    }
    values.payer_id = payer;
  }
  if (body.expense_date !== undefined && body.expense_date !== "") {
    if (!DATE.test(body.expense_date) || Number.isNaN(Date.parse(body.expense_date))) {
      return { error: "Date must be a valid date." };
    }
    values.expense_date = body.expense_date;
  }
  return { values };
}

export async function listExpenses(req, res, next) {
  try {
    const [expenses, trip] = await Promise.all([
      pool.query(`${EXPENSE_SELECT} WHERE e.trip_id = $1 ORDER BY e.expense_date DESC, e.id DESC`, [req.tripId]),
      pool.query("SELECT budget FROM trips WHERE id = $1", [req.tripId]),
    ]);
    const total = expenses.rows.reduce((sum, row) => sum + row.amount, 0);
    res.json({
      expenses: expenses.rows,
      total: Math.round(total * 100) / 100,
      budget: trip.rows[0].budget,
    });
  } catch (error) {
    next(error);
  }
}

export async function createExpense(req, res, next) {
  try {
    const { values, error } = await validateExpense(req.body, req.tripId);
    if (error) return res.status(400).json({ error });
    const { rows } = await pool.query(
      `INSERT INTO expenses (trip_id, payer_id, created_by_id, description, amount, expense_date)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, CURRENT_DATE)) RETURNING id`,
      [req.tripId, values.payer_id, req.userId, values.description, values.amount, values.expense_date ?? null],
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    next(err);
  }
}

// Loads the expense and the acting user's membership, or responds 404/403.
export async function loadExpense(req, res, next) {
  try {
    const id = Number(req.params.expenseId);
    const found = Number.isInteger(id)
      ? await pool.query(
          `SELECT e.id, e.trip_id, e.created_by_id, m.role
           FROM expenses e LEFT JOIN trip_members m ON m.trip_id = e.trip_id AND m.user_id = $2
           WHERE e.id = $1`,
          [id, req.userId],
        )
      : { rowCount: 0 };
    if (found.rowCount === 0) return res.status(404).json({ error: "Expense not found." });
    if (!found.rows[0].role) {
      return res.status(403).json({ error: "You are not a member of this trip." });
    }
    if (req.method !== "GET" && found.rows[0].created_by_id !== req.userId) {
      return res.status(403).json({ error: "You can only change expenses you recorded." });
    }
    req.expense = found.rows[0];
    next();
  } catch (error) {
    next(error);
  }
}

export async function updateExpense(req, res, next) {
  try {
    const { values, error } = await validateExpense(req.body, req.expense.trip_id, { partial: true });
    if (error) return res.status(400).json({ error });
    const keys = Object.keys(values);
    if (keys.length === 0) return res.status(400).json({ error: "Nothing to update." });
    const sets = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    await pool.query(
      `UPDATE expenses SET ${sets}, updated_at = NOW() WHERE id = $1`,
      [req.expense.id, ...keys.map((key) => values[key])],
    );
    res.json({ id: req.expense.id });
  } catch (err) {
    next(err);
  }
}

export async function deleteExpense(req, res, next) {
  try {
    await pool.query("DELETE FROM expenses WHERE id = $1", [req.expense.id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
