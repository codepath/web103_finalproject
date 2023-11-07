import { pool } from "../config/database.js";

import bcrypt from "bcrypt";

const emailExists = async (email) => {
  const data = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (data.rowCount == 0) return false;
  return data.rows[0];
};

const createUser = async (email, password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const data = await pool.query(
    "INSERT INTO users(email, password) VALUES ($1, $2) RETURNING id, email, password",
    [email, hash]
  );

  if (data.rowCount == 0) return false;
  return data.rows[0];
};

const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};

export default { emailExists, createUser, matchPassword };
