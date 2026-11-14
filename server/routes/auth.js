import { Router } from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";
import passport from "../config/passport.js";
import {
  authCookie,
  stateCookie,
  cookieOptions,
  clientOrigin,
  signToken,
  verifyToken,
} from "../config/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
router.get("/google", (req, res, next) => {
  const state = randomBytes(32).toString("hex");
  res.cookie(stateCookie, signToken({ purpose: "oauth-state", state }, "10m"), {
    ...cookieOptions,
    maxAge: 600000,
  });
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});
router.get("/google/callback", (req, res, next) => {
  res.clearCookie(stateCookie, cookieOptions);
  try {
    const claims = verifyToken(req.cookies?.[stateCookie]);
    const state = req.query.state;
    if (
      claims.purpose !== "oauth-state" ||
      typeof state !== "string" ||
      typeof claims.state !== "string" ||
      state.length !== claims.state.length ||
      !timingSafeEqual(Buffer.from(state), Buffer.from(claims.state))
    )
      throw new Error("Invalid state");
  } catch {
    return res.redirect(`${clientOrigin}/login?error=state`);
  }
  passport.authenticate("google", { session: false }, (error, user, info) => {
    if (error || !user) {
      // Log only diagnostic identifiers, never provider responses, tokens or credentials.
      if (error) console.error("Google login failed", { name: error.name, code: error.code });
      const reason = error?.code === "42703" ? "migration"
        : error ? "server"
        : ["email", "account"].includes(info?.code) ? info.code : "google";
      return res.redirect(`${clientOrigin}/login?error=${reason}`);
    }
    res.cookie(
      authCookie,
      signToken({ sub: String(user.id), purpose: "access" }),
      { ...cookieOptions, maxAge: 900000 },
    );
    res.redirect(`${clientOrigin}/trips`);
  })(req, res, next);
});
router.get("/me", requireAuth, (req, res) => res.json(req.user));
router.post("/logout", (_req, res) => {
  res.clearCookie(authCookie, cookieOptions);
  res.clearCookie(stateCookie, cookieOptions);
  res.sendStatus(204);
});
export default router;
