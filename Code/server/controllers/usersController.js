import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { establishSession } from "../config/session.js";

const SALT_ROUNDS = 10;

// Columns safe to hand back to the client — never password_hash
const PUBLIC_COLUMNS = `user_id AS id, username, email, profile_image_url, total_points AS points`;

// Same shape check the client runs in utilities/validateLogin.js
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_-]+$/;

// Column widths come from users in db/schema.sql
const EMAIL_MAX = 255;
const USERNAME_MIN = 3;
const USERNAME_MAX = 50;

// bcrypt only reads the first 72 bytes of a password. Anything longer would be
// silently truncated, so a user could "log in" with a prefix of what they typed.
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;

const EMAIL_TAKEN = "That email is already registered.";
const USERNAME_TAKEN = "That username is taken.";

// Returns an error string, or null when the signup body is usable.
function validateSignup(username, email, password) {
    if (!username || !email || !password) {
        return "Username, email and password are required";
    }
    if (!EMAIL_PATTERN.test(email) || email.length > EMAIL_MAX) {
        return "Enter a valid email address (e.g. name@example.com).";
    }
    if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
        return `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters.`;
    }
    if (!USERNAME_PATTERN.test(username)) {
        return "Username can only contain letters, numbers, hyphens and underscores.";
    }
    if (password.length < PASSWORD_MIN) {
        return `Password must be at least ${PASSWORD_MIN} characters.`;
    }
    if (password.length > PASSWORD_MAX) {
        return `Password must be ${PASSWORD_MAX} characters or fewer.`;
    }
    return null;
}

// GET /api/users — all users ranked by points (fan leaderboard)
export async function getAllUsers(req, res) {
    try {
        const result = await pool.query(
            `SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY total_points DESC`,
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// GET /api/users/:id — a single user's profile
export async function getUserById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(
            `SELECT ${PUBLIC_COLUMNS} FROM users WHERE user_id = $1`,
            [id],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// POST /api/users/login — verify credentials, return the user
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Signup lowercases the address before storing it, so match the same way
        // — otherwise "Carla@Example.com" can't sign in to carla@example.com.
        const result = await pool.query(
            `SELECT ${PUBLIC_COLUMNS}, password_hash FROM users WHERE LOWER(email) = $1 LIMIT 1`,
            [email.trim().toLowerCase()],
        );
        const user = result.rows[0];

        // A GitHub-only account has a NULL password_hash — it has to sign in
        // through OAuth. Same generic error either way, so this endpoint never
        // reveals which emails are registered.
        if (
            !user ||
            !user.password_hash ||
            !(await bcrypt.compare(password, user.password_hash))
        ) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const { password_hash: _hash, ...safeUser } = user;

        // Same session an OAuth sign-in gets, so req.user is populated for every
        // logged-in user rather than only the GitHub ones.
        await establishSession(req, safeUser);

        res.status(200).json(safeUser);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// POST /api/users — create an account (sign up)
export async function createUser(req, res) {
    try {
        const username = (req.body.username ?? "").trim();
        // Stored lowercased so the UNIQUE constraint actually stops someone
        // re-registering the same address with different capitalisation.
        const email = (req.body.email ?? "").trim().toLowerCase();
        const password = req.body.password ?? "";

        const validationError = validateSignup(username, email, password);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        // Check before hashing — bcrypt at cost 10 costs ~100ms, no sense
        // spending it on an insert we already know will fail.
        const existing = await pool.query(
            `SELECT LOWER(email) = $1 AS email_taken,
                    LOWER(username) = LOWER($2) AS username_taken
             FROM users
             WHERE LOWER(email) = $1 OR LOWER(username) = LOWER($2)`,
            [email, username],
        );
        if (existing.rows.some((row) => row.email_taken)) {
            return res.status(409).json({ error: EMAIL_TAKEN });
        }
        if (existing.rows.some((row) => row.username_taken)) {
            return res.status(409).json({ error: USERNAME_TAKEN });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, total_points)
             VALUES ($1, $2, $3, 0)
             RETURNING ${PUBLIC_COLUMNS}`,
            [username, email, passwordHash],
        );

        // Signup navigates straight to /home, so it needs a live session there
        // just as much as login does.
        await establishSession(req, result.rows[0]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        // The check above is check-then-insert, so a concurrent signup can still
        // beat us to the name. The unique constraint is the real guarantee.
        if (error.code === "23505") {
            return res.status(409).json({
                error:
                    error.constraint === "users_username_key"
                        ? USERNAME_TAKEN
                        : EMAIL_TAKEN,
            });
        }
        console.error("createUser failed:", error);
        res.status(500).json({
            error: "Could not create the account. Please try again.",
        });
    }
}

// PATCH /api/users/:id — update profile (username, image, points)
export async function updateUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { username, profile_image_url, total_points } = req.body;
        const result = await pool.query(
            `UPDATE users
             SET username = COALESCE($1, username),
                 profile_image_url = COALESCE($2, profile_image_url),
                 total_points = COALESCE($3, total_points)
             WHERE user_id = $4
             RETURNING ${PUBLIC_COLUMNS}`,
            [
                username ?? null,
                profile_image_url ?? null,
                total_points ?? null,
                id,
            ],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}
