import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isValidEmail } from "../utils/validators.js";

// const user = [
//   {
//     id: 1,
//     first_name: "Alex",
//     last_name: "Rivera",
//     phone_number: "732-555-0192",
//     email: "alex.rivera@email.com",
//     password: "hashed_password_1",
//     address_line_1: "84 Maple Street",
//     address_line_2: null,
//     city: "Newark",
//     state: "NJ",
//     zipcode: "07101",
//   },
//   {
//     id: 2,
//     first_name: "Jordan",
//     last_name: "Patel",
//     phone_number: "908-555-0347",
//     email: "jordan.patel@email.com",
//     password: "hashed_password_2",
//     address_line_1: "210 Oak Avenue",
//     address_line_2: "Apt 4B",
//     city: "Edison",
//     state: "NJ",
//     zipcode: "08817",
//   },
// ];

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  try {
    //Backend validations

    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required to register." });
    }

    if (first_name.length > 20 || last_name.length > 20) {
      return res
        .status(400)
        .json({ message: "Must be less than 20 characters long. Try again." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ message: "Passwords do not match. Try again." });
    }

    const userExist = await client.query(
      "SELECT email FROM users WHERE email=$1",
      [email],
    );

    if (userExist.rows[0]) {
      return res
        .status(409)
        .json({ message: "User already exist. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await client.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, email, hashedPassword],
    );

    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
