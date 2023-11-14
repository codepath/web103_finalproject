import jwt from "jsonwebtoken";

const middlewareAuthentication = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    try {
      const results = await pool.query(
        `SELECT * FROM users WHERE users.email = ${1}`,
        [decoded.email]
      );
      if (results.rows.length < 1) {
        return res.status(401).send("Invalid Token");
      }
    } catch (err) {
      return res.status(400).send(err.message);
    }

    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

export default middlewareAuthentication;
