import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { GitHub } from "./config/auth.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();

app.use(
  session({
    secret: "codepath",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

app.get("/", (req, res) => {
  res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">BookBuddy API</h1>');
});

passport.serializeUser((user, done) => {
  const { accesstoken, ...sessionUser } = user;
  done(null, sessionUser);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/api/auth/", authRoutes);
app.use("/api/books/", bookRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
