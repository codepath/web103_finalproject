import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { client } from "../config/database.js";
import { isValidEmail } from "../utils/validators.js";

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  try {
    //Backend validations

    //Non-Empty Fields Validations || Passed ✅
    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required to register." });
    }

    //User's Name Length Validation || Passed ✅
    if (first_name.length > 20 || last_name.length > 20) {
      return res
        .status(400)
        .json({ message: "Must be less than 20 characters long. Try again." });
    }

    //Valid Email Expression Validation || Passed ✅
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    //Valid Password Length Validation || Passed ✅
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    //Password-Valid Password Check || Passed ✅
    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ message: "Passwords do not match. Try again." });
    }

    //Checking if user already exist
    const userExist = await client.query(
      "SELECT email FROM users WHERE email=$1",
      [email],
    );

    //Existing User Validation || Passed ✅
    if (userExist.rows[0]) {
      return res
        .status(409)
        .json({ message: "User already exist. Please log in." });
    }

    //Hashing Password to Protect User's Account || Passed ✅
    const hashedPassword = await bcrypt.hash(password, 10);

    //Saving User's Data in Database || Passed ✅
    const newUser = await client.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, email",
      [first_name, last_name, email, hashedPassword],
    );

    console.log(newUser.rows[0].id);

    //Create Cart upon User Registration || Passed ✅
    await client.query(
      `
      INSERT INTO cart(user_id) VALUES($1)`,
      [newUser.rows[0].id],
    );

    //Save User ID and Email in Token for Authentication || Passed ✅
    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Check if all fields are entered || Passed ✅
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields must be entered to login." });
    }

    //Check if email is valid || Passed ✅
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. Try again." });
    }

    const user = await client.query(
      "SELECT id, email, password FROM users WHERE email=$1",
      [email],
    );

    //Check if correct email is entered || Passed ✅
    if (!user.rows[0]) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. Try again" });
    }

    const hashedPassword = await bcrypt.compare(
      password,
      user.rows[0].password,
    );

    //Check if correct password is entered || Passed ✅
    if (!hashedPassword) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. Try again." });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({ token, message: "Login successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, first_name, last_name, email FROM users",
    );

    if (result.rowCount === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "Data not provided" });
    }

    const user = await client.query(
      `
      SELECT first_name, last_name, email
      FROM users
      WHERE id=$1
      `,
      [userId],
    );

    if (user.rowCount === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
