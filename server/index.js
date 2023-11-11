import express from "express";

import morgan from "morgan";
import cors from "cors";
import setup from "./src/utils/setup.js";

import passport from "passport";
import session from "express-session";
import { GitHub } from "./src/configs/auth.config.js";
import { sessionConfig } from "./src/configs/session.config.js";
import { corsConfig } from "./src/configs/cors.config.js";
import { checkAuthentication } from "./src/middlewares/checkAuthentication.js";

import authRouter from "./src/routes/auth.js";
import usersRouter from "./src/routes/users.js";

setup();

const app = express();

app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(session(sessionConfig));
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy required for https
}
app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRouter);

app.use("/api/users", checkAuthentication, usersRouter);

app.listen(process.env.PORT, () => {
  console.log(`server listening on http://localhost:${process.env.PORT}`);
});
