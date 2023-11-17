import express from "express";
import passport from "passport";

import User from "../models/user.js";
import { GitHub } from "../configs/auth.config.js";

const router = express.Router();

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      res.clearCookie("connect.sid");
      res.json({ status: true, message: "Logged out" });
    });
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/home",
    failureRedirect: "/",
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await User.findOne(id);
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});

passport.use(GitHub);

export default router;
