import User from "../models/user.js";

const getCurrentUser = async (req, res) => {
  try {
    // req.session.passport.user only contains the user's id
    const { rows } = await User.findOne(req.session.passport.user);
    return res.status(200).json(rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const { rows } = await User.update(req.session.passport.user, req.body);
    return res.status(200).json(rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  getCurrentUser,
  updateCurrentUser,
};
