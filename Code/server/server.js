// must come first: loads .env before any module below reads process.env
import "./config/dotenv.js";

import express from "express";
import path from "path";
import cors from "cors";

import passport from "passport";
import session from "express-session";
import strategies from "./config/auth.js";
import { sessionOptions } from "./config/session.js";
import { CLIENT_URL, SERVER_URL } from "./config/urls.js";
import { pool } from "./config/database.js";

// import the router from each routes file
import usersRouter from "./routes/usersRoutes.js";
import matchesRouter from "./routes/matchesRoutes.js";
import playersRouter from "./routes/playersRoutes.js";
import teamsRouter from "./routes/teamsRoutes.js";
import predictionsRouter from "./routes/predictionsRoutes.js";
import commentsRouter from "./routes/commentsRoutes.js";
import followsRouter from "./routes/followsRoutes.js";
import notificationsRouter from "./routes/notificationsRoutes.js";
import videosRouter from "./routes/videosRoutes.js";
import authRouter from "./routes/auth.js";

const PORT = process.env.PORT || 3000;

const app = express();

// Behind Render's proxy Express sees the internal http hop, so without this the
// `secure` session cookie is never set at all.
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(express.json());
app.use(session(sessionOptions));
app.use(
    cors({
        origin: CLIENT_URL,
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
    }),
);

// passport setup + strategies
app.use(passport.initialize());
app.use(passport.session());
passport.use(strategies.GitHub);

// session support: store only the id in the session, then re-read the row on
// each request so password_hash never reaches the session store or the client
// the strategy hands back a raw row (user_id); a deserialized row is aliased to id
passport.serializeUser((user, done) => {
    done(null, user.user_id ?? user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query(
            `SELECT user_id AS id, username, email, profile_image_url, total_points AS points
             FROM users WHERE user_id = $1`,
            [id],
        );
        done(null, result.rows[0] || false);
    } catch (error) {
        done(error);
    }
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static("public"));
}

// specify the api path for the server to use
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/players", playersRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/predictions", predictionsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/follows", followsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/videos", videosRouter);

if (process.env.NODE_ENV === "production") {
    app.get("/*", (_, res) =>
        res.sendFile(path.resolve("public", "index.html")),
    );
}

// Must be last, and must take four arguments — that arity is the only way
// Express recognises an error handler. Without it a throw anywhere (notably in
// the OAuth verify callback) renders a raw stack page to the browser.
app.use((err, req, res, next) => {
    console.error("unhandled error:", err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: "Something went wrong." });
});

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT} (public origin: ${SERVER_URL})`);
});
