import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db.config.js";

const pgSession = connectPgSimple(session);

export const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 3600000, // 1 hour
  },
};
