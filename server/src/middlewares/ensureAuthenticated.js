export const ensureAuthenticated = (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
