import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { GitHub } from "./config/auth.js";
import connectRedis from 'connect-redis';
import { createClient } from 'redis';

import gamesRouter from "./routes/games.js";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const RedisStore = connectRedis(session);

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: 'redis-15005.c11.us-east-1-2.ec2.cloud.redislabs.com',
      port: process.env.REDIS_PORT
  }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect();
const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://playpal-client-app.up.railway.app"
    : "http://localhost:3000";
app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "sq7taigbtwo2brbsdasdy",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

app.use(passport.session());

passport.use(GitHub);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get("/", (req, res) => {
  res.redirect(CLIENT_URL);
});
app.use("/auth", authRouter);
app.use("/games", gamesRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
