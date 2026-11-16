import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "./config/database.js";
import passport, { configurePassport } from "./config/passport.js";
import { clientOrigin, authCookie, cookieOptions } from "./config/auth.js";
import { requireTrustedOrigin } from "./middleware/auth.js";
import routes from "./routes/index.js";
import { serveClient } from "./config/client.js";

const app = express();

//middleware
configurePassport();
app.use(cors({ origin: clientOrigin, credentials: true }));
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use("/api", requireTrustedOrigin);
const PgStore = connectPgSimple(session);
app.use("/api", session({
  name: authCookie,
  store: new PgStore({ pool, tableName: "user_sessions" }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 },
}));
app.use("/api", passport.initialize());
app.use("/api", passport.session());
app.use(express.json());

app.use("/api", routes);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

if (process.env.NODE_ENV === "production") serveClient(app);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

export default app;
