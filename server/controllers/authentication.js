import { pool } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    // Get user input
    const { name, email, password, phone } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      return res.status(400).send("All input is required");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user with details
    let user = [email.toLowerCase(), name, phone, encryptedPassword];

    // Create user in our database
    try {
      await pool.query(
        `INSERT INTO users (email, name, phone_number, password) VALUES ($1, $2, $3, $4)`,
        user
      );
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ error: "Internal Server Error. " + error.message });
    }

    // Specify the maxAge of the JWT token
    const maxAge = 3 * 60 * 60;

    // Create token
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: maxAge,
    });

    // Send token as a cookie to the user
    res.cookie("kulboard", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    // Return new user and token
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

const loginUser = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    console.log(email, password);

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    // Query to get user details from the database
    let user = {};
    try {
      const results = await pool.query(
        `SELECT * FROM users WHERE users.email = $1`,
        [email]
      );
      user = results.rows[0];

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Match the database and user provided password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      // Specify the maxAge of the JWT token
      const maxAge = 3 * 60 * 60;

      // Create token
      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge,
      });

      // Send this token as a cookie to the user
      res.cookie("kulboard", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });

      // Return new user
      res.status(200).json(user);
    } else {
      // Password does not match
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err.message);
  }
};

// check if a userName exists
const userEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    const results = await pool.query(
      `SELECT users.email FROM users WHERE users.email = $1`,
      [email]
    );
    if (results.rows.length > 0) {
      res.status(200).json({ validUser: true, message: "Email exists" });
    } else {
      res
        .status(400)
        .json({ validUser: false, message: "Email does not exist" });
    }
  } catch (error) {
    res.status(400).json({ validUser: false, error: error.message });
  }
};

export default {
  userEmailExists,
  registerUser,
  loginUser,
};
