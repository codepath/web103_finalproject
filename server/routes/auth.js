import express from "express";
import passport from "passport";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local-login", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

router.post(
  "/signup",
  passport.authenticate("local-signup", { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user,
    });
  }
);

export default router;
