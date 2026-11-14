
import { randomBytes, createHash } from "node:crypto";

import {
  pool,
  requestContext,
} from "../config/db.js";

const COOKIE = "prepwise_session";

const TTL = 7 * 24 * 60 * 60 * 1000;

function hash(token) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function options() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

function tokenFrom(req) {
  const token = (req.headers.cookie || "")
    .split(";")
    .map((item) => item.trim())
    .find((item) =>
      item.startsWith(COOKIE + "=")
    )
    ?.slice(COOKIE.length + 1);

  return /^[a-f0-9]{64}$/.test(token || "")
    ? token
    : null;
}

// Create a secure login session.

export async function createSession(userId, res) {
  const token = randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + TTL);

  await pool.query(
    `INSERT INTO auth_sessions (
      token_hash,
      user_id,
      expires_at
    )
    VALUES ($1, $2, $3)`,
    [
      hash(token),
      userId,
      expiresAt,
    ]
  );

  res.cookie(COOKIE, token, {
    ...options(),
    maxAge: TTL,
  });
}

// Remove the current session.

export async function destroySession(req, res) {
  const token = tokenFrom(req);

  if (token) {
    await pool.query(
      "DELETE FROM auth_sessions WHERE token_hash = $1",
      [hash(token)]
    );
  }

  res.clearCookie(COOKIE, options());
}

// Protect private application routes.

export async function requireAuth(req, res, next) {
  try {
    const token = tokenFrom(req);

    if (!token) {
      return res.status(401).json({
        error: "Please sign in.",
      });
    }

    const { rows } = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email
      FROM auth_sessions s
      JOIN users u
        ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > NOW()
        AND u.password_hash IS NOT NULL`,
      [hash(token)]
    );

    if (!rows[0]) {
      res.clearCookie(COOKIE, options());

      return res.status(401).json({
        error: "Your session expired. Sign in again.",
      });
    }

    req.user = rows[0];

    requestContext.run(
      { userId: req.user.id },
      () => next()
    );

  } catch (error) {
    next(error);
  }
}

// Protect database-changing requests.

export function protectWrites(req, res, next) {
  if (
    ["GET", "HEAD", "OPTIONS"].includes(req.method)
  ) {
    return next();
  }

  if (
    req.get("X-PrepWise-Request") !== "1" ||
    req.get("Sec-Fetch-Site") === "cross-site"
  ) {
    return res.status(403).json({
      error: "Request not allowed.",
    });
  }

  next();
}
