const isManager = (req, res, next) => {
  if (req.user.user_role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export default isManager;
