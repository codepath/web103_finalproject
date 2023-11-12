import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/login/success", (req, res) => {
  if (req.user) {
    // req.user only contains the user's id
    res.status(200).json({ success: true, user_id: req.user });
  } else {
    res.status(401).json({ success: false, message: "failure" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, message: "failure" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      res.clearCookie("connect.sid");
      res.json({ status: "logout", user_id: null });
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

export default router;
