import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db.config.js";

const pgSession = connectPgSimple(session);

let cookieConfig;

if (process.env.NODE_ENV === "development") {
  cookieConfig = {
    // can only be accessed by server requests
    httpOnly: true,
    // path = where the cookie is valid
    path: "/",
    // domain = what domain the cookie is valid on
    domain: "localhost",
    // secure = only send cookie over https
    secure: false,
    // sameSite = only send cookie if the request is coming from the same origin
    sameSite: "lax", // "strict" | "lax" | "none" (secure must be true)
    // maxAge = how long the cookie is valid for in milliseconds
    maxAge: 3600000, // 1 hour
  };
}

if (process.env.NODE_ENV === "production") {
  cookieConfig = {
    // can only be accessed by server requests
    httpOnly: true,
    // path = where the cookie is valid
    path: "/",
    // secure = only send cookie over https
    secure: true,
    // sameSite = only send cookie if the request is coming from the same origin
    sameSite: "none", // "strict" | "lax" | "none" (secure must be true)
    // maxAge = how long the cookie is valid for in milliseconds
    maxAge: 3600000, // 1 hour
  };
}

export const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: cookieConfig,
};
