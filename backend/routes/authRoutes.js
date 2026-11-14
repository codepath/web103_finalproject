
import { Router } from "express";

import {
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

import { promisify } from "node:util";

import { pool } from "../config/db.js";

import {
  createSession,
  destroySession,
  requireAuth,
} from "../middleware/auth.js";

const router = Router();

const derive = promisify(scrypt);

const attempts = new Map();

// Limit repeated authentication attempts.

function limit(req, res, next) {
  const now = Date.now();

  const key = req.ip;

  for (const [ip, row] of attempts) {
    if (row.until <= now) {
      attempts.delete(ip);
    }
  }

  if (!attempts.has(key)) {
    if (attempts.size >= 10000) {
      return res.status(429).json({
        error: "Too many requests.",
      });
    }

    attempts.set(key, {
      count: 0,
      until: now + 900000,
    });
  }

  const row = attempts.get(key);

  row.count++;

  if (row.count > 30) {
    res.set(
      "Retry-After",
      String(
        Math.ceil((row.until - now) / 1000)
      )
    );

    return res.status(429).json({
      error: "Too many attempts. Try again later.",
    });
  }

  next();
}

// Validate user details.

function emailOf(value) {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function validEmail(value) {
  return (
    value.length <= 255 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function validPassword(value) {
  return (
    typeof value === "string" &&
    value.length >= 12 &&
    value.length <= 128
  );
}

// Hash passwords using scrypt.

async function passwordHash(password) {
  const salt = randomBytes(16).toString("hex");

  const key = await derive(
    password,
    salt,
    64
  );

  return `${salt}:${key.toString("hex")}`;
}

// Verify a password against its saved hash.

async function verify(password, stored) {
  const fallback =
    "0".repeat(32) + ":" + "0".repeat(128);

  const [salt, expected] = String(
    stored || fallback
  ).split(":");

  if (
    !/^[a-f0-9]{32}$/.test(salt) ||
    !/^[a-f0-9]{128}$/.test(expected || "")
  ) {
    return false;
  }

  const actual = await derive(
    password,
    salt,
    64
  );

  return (
    timingSafeEqual(
      actual,
      Buffer.from(expected, "hex")
    ) &&
    Boolean(stored)
  );
}

// ==========================================
// REGISTER
// ==========================================

router.post(
  "/register",
  limit,

  async (req, res, next) => {
    try {
      const name =
        typeof req.body?.name === "string"
          ? req.body.name.trim()
          : "";

      const email = emailOf(req.body?.email);

      const password = req.body?.password;

      if (
        !name ||
        name.length > 100 ||
        !validEmail(email) ||
        !validPassword(password)
      ) {
        return res.status(400).json({
          error:
            "Enter a name, valid email, and password of 12–128 characters.",
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING id, name, email`,
        [
          name,
          email,
          await passwordHash(password),
        ]
      );

      await destroySession(req, res);

      await createSession(
        rows[0].id,
        res
      );

      res.status(201).json({
        user: rows[0],
      });

    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error:
            "An account with that email already exists.",
        });
      }

      next(error);
    }
  }
);

// ==========================================
// LOGIN
// ==========================================

router.post(
  "/login",
  limit,

  async (req, res, next) => {
    try {
      const email = emailOf(req.body?.email);

      const password = req.body?.password;

      if (
        !validEmail(email) ||
        typeof password !== "string" ||
        password.length > 128
      ) {
        return res.status(401).json({
          error: "Invalid email or password.",
        });
      }

      const { rows } = await pool.query(
        `SELECT
          id,
          name,
          email,
          password_hash
        FROM users
        WHERE LOWER(email) = $1`,
        [email]
      );

      const user = rows[0];

      const valid = await verify(
        password,
        user?.password_hash
      );

      if (!valid || !user) {
        return res.status(401).json({
          error: "Invalid email or password.",
        });
      }

      await destroySession(req, res);

      await createSession(user.id, res);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// CURRENT ACCOUNT
// ==========================================

router.get(
  "/me",
  requireAuth,

  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);

// ==========================================
// LOGOUT
// ==========================================

router.post(
  "/logout",

  async (req, res, next) => {
    try {
      await destroySession(req, res);

      res.json({
        success: true,
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;
