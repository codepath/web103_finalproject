import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/games",
  })
);

router.get("/login/success", (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ success: true, user: req.user });
    }
  } catch (e) {
    res.status(409).json({ success: false, mesage: e });
    console.log(e);
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: true, message: "failure" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(error);
    }

    req.session.destroy((err) => {
      res.clearCookie("connect.sid");
      res.json({ status: "logout", user: {} });
    });
  });
});

export default router;
