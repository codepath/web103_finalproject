import { Router } from "express";
import passport from "../config/passport.js";
import { authCookie, cookieOptions, clientOrigin, safeReturnTo } from "../config/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use((_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
router.get("/github", (req, res, next) => {
  req.session.returnTo = safeReturnTo(req.query.returnTo);
  passport.authenticate("github")(req, res, next);
});
router.get("/github/callback", (req, res, next) => {
  const returnTo = safeReturnTo(req.session.returnTo);
  passport.authenticate("github", (error, user) => {
    if (error || !user) {
      if (error) console.error("GitHub login failed", { name: error.name, code: error.code });
      return res.redirect(`${clientOrigin}/login?error=${error ? "server" : "github"}`);
    }
    // Passport regenerates the session on login to prevent session fixation.
    req.logIn(user, (error) => {
      if (error) return next(error);
      req.session.save((error) => {
        if (error) return next(error);
        res.redirect(`${clientOrigin}${returnTo}`);
      });
    });
  })(req, res, next);
});
router.get("/me", requireAuth, (req, res) => res.json(req.user));
router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy((error) => {
      if (error) return next(error);
      res.clearCookie(authCookie, cookieOptions);
      res.sendStatus(204);
    });
  });
});
export default router;
