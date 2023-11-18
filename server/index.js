import express from "express";
import https from "https";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import morgan from "morgan";
import seed from "./src/utils/seed.js";

import passport from "passport";
import session from "express-session";
import { sessionConfig } from "./src/configs/session.config.js";

import favicon from "serve-favicon";

import authRouter from "./src/routes/auth.js";
import usersRouter from "./src/routes/users.js";
import schoolsRouter from "./src/routes/schools.js";
import subjectsRouter from "./src/routes/subjects.js";
import availabilitiesRouter from "./src/routes/availabilities.js";
import { ensureAuthenticated } from "./src/middlewares/ensureAuthenticated.js";

seed();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("trust proxy", 1); // trust first proxy required for https
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRouter);

app.use("/api/users", ensureAuthenticated, usersRouter);
app.use("/api/schools", ensureAuthenticated, schoolsRouter);
app.use("/api/subjects", ensureAuthenticated, subjectsRouter);
app.use("/api/availabilities", availabilitiesRouter);

app.use(favicon(path.resolve("public", "vite.svg")));
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

let server;

if (process.env.NODE_ENV === "development") {
  server = https.createServer(
    {
      key: fs.readFileSync(`${__dirname}/certs/key.pem`, "utf8"),
      cert: fs.readFileSync(`${__dirname}/certs/cert.pem`, "utf8"),
    },
    app
  );
} else if (process.env.NODE_ENV === "production") {
  server = app;
}

server.listen(process.env.PORT, (_) => {
  console.log(`Server listening on port https://localhost:${process.env.PORT}`);
});
