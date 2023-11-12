import express from "express";
import https from "https";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import morgan from "morgan";
import setup from "./src/utils/setup.js";

import passport from "passport";
import session from "express-session";
import { GitHub } from "./src/configs/auth.config.js";
import { sessionConfig } from "./src/configs/session.config.js";
import { checkAuthentication } from "./src/middlewares/checkAuthentication.js";
import User from "./src/models/user.js";

import favicon from "serve-favicon";

import authRouter from "./src/routes/auth.js";
import usersRouter from "./src/routes/users.js";
import schoolsRouter from "./src/routes/schools.js";
import subjectsRouter from "./src/routes/subjects.js";

setup();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(session(sessionConfig));
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy required for https
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

passport.serializeUser((id, done) => {
  done(null, id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await User.findOne(id);
    done(null, rows[0].id);
  } catch (error) {
    done(error);
  }
});

if (process.env.NODE_ENV === "development") {
  app.use(favicon(path.resolve("../", "client", "public", "vite.svg")));
} else if (process.env.NODE_ENV === "production") {
  app.use(favicon(path.resolve("public", "vite.svg")));
  app.use(express.static("public"));
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);

app.use("/api/users", checkAuthentication, usersRouter);
app.use("/api/schools", checkAuthentication, schoolsRouter);
app.use("/api/subjects", checkAuthentication, subjectsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = https.createServer(
  {
    key: fs.readFileSync(`${__dirname}/certs/key.pem`, "utf8"),
    cert: fs.readFileSync(`${__dirname}/certs/cert.pem`, "utf8"),
  },
  app
);

server.listen(process.env.PORT, (_) => {
  console.log(`Server listening on port https://localhost:${process.env.PORT}`);
});
