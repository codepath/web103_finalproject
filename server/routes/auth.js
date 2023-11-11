import express from "express";
import passport from "passport";
import { pool } from "../config/database.js";
import { comparePassword, hashPassword } from "../utils/helpers.js";

const router = express.Router();

// router.post("/login", async (request, response) => {
//   const { email, password } = request.body;
//   if (!email || !password) {
//     return response.status(400).json({ message: "Missing credentials" });
//   }
//   try {
//     const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
//       email,
//     ]);
//     if (!result.rows || result.rows.length === 0) {
//       return response.status(401).json({ message: "Invalid credentials" });
//     }
//     const user = result.rows[0];
//     const isValid = comparePassword(password, user.password);
//     if (isValid) {
//       request.session.user = user;
//       return response.status(200).json({ message: "Logged in successfully" });
//     } else {
//       return response.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     return response.status(500).json({ error: error.message });
//   }
// });

router.post('/login', passport.authenticate('local'), (request, response, next) => {   
    response.status(200).json({ message: 'Logged in successfully' });
})

router.post("/register", async (request, response) => {
  try {
    const {
      first_name,
      last_name,
      zipcode,
      phone,
      user_name,
      email,
      password,
    } = request.body;
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (user.rows > 0) {
      response.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = hashPassword(password);
      try {
        const newUser = await pool.query(
          `INSERT INTO users (first_name, last_name, zipcode, phone, user_name, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            first_name,
            last_name,
            zipcode,
            phone,
            user_name,
            email,
            hashedPassword,
          ]
        );
        response.status(201).json(newUser.rows[0]);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// router.post(
//   "/signup",
//   passport.authenticate("local-signup", { session: false }),
//   (req, res, next) => {
//     res.json({
//       user: req.user,
//     });
//   }
// );

export default router;
