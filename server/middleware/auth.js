import pool from "../config/database.js";
import { authCookie, clientOrigin, verifyToken } from "../config/auth.js";

export function requireTrustedOrigin(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("origin") !== clientOrigin) {
    return res.status(403).json({ error: "Request origin is not allowed." });
  }
  next();
}

export async function requireAuth(req, res, next) {
  let claims;
  try {
    claims = verifyToken(req.cookies?.[authCookie]);
    if (claims.purpose !== "access" || !/^[1-9]\d*$/.test(claims.sub))
      throw new Error("Invalid token");
  } catch {
    return res.status(401).json({ error: "Please sign in with Google." });
  }
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [claims.sub],
    );
    if (!rows.length)
      return res.status(401).json({ error: "Please sign in with Google." });
    req.user = rows[0];
    req.userId = req.user.id;
    next();
  } catch (error) {
    next(error);
  }
}
