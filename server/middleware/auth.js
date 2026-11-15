import { clientOrigin } from "../config/auth.js";

export function requireTrustedOrigin(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("origin") !== clientOrigin) {
    return res.status(403).json({ error: "Request origin is not allowed." });
  }
  next();
}
export function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Please sign in with GitHub." });
  req.userId = req.user.id;
  next();
}
