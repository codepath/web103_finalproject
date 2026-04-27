import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "flowerhunt-dev-secret";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      user_role: user.user_role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (username, password, user_role, user_gallery)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING id, username, user_role, created_at, user_gallery`,
      [username, hashedPassword, "user", JSON.stringify([])]
    );

    const user = rows[0];
    const token = createToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      error: "Could not register user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      user_role: user.user_role,
      created_at: user.created_at,
      user_gallery: user.user_gallery,
    };

    const token = createToken(safeUser);

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Could not log in user",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { rows } = await pool.query(
      `SELECT id, username, user_role, created_at, user_gallery
       FROM users
       WHERE id = $1`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Current user error:", error);
    res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

export { registerUser, loginUser, getCurrentUser };