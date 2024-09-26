import passport from "passport";
import { Strategy } from "passport-local";
import { pool } from "../config/database.js";
import { comparePassword } from "../utils/helpers.js";

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      console.log(email);
      console.log(password);
      try {
        if (!email || !password) {
          return response.status(400).json({ message: "Missing credentials" });
        }
        const result = await pool.query(
          `SELECT * FROM users WHERE email = $1`,
          [email]
        );
        if (!result.rows || result.rows.length === 0) {
          return response.status(401).json({ message: "Invalid credentials" });
        }
        const user = result.rows[0];
        const isValid = comparePassword(password, user.password);
        if (isValid) {
          console.log("authenticated successfully");
          done(null, user);
        } else {
          console.log("invalid credentials");
          done(null, null);
        }
      } catch (error) {
        console.log(error);
        done(error, null);
      }
    }
  )
);
