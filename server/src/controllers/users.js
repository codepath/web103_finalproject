import User from "../models/user.js";

const getUsers = async (req, res) => {
  try {
    const { rows } = await User.findAll();
    return res.status(200).json(rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { rows } = await User.findOne(req.params.id);
    return res.status(200).json(rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { rows } = await User.update(req.params.id, req.body);
    return res.status(200).json(rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { rows } = await User.remove(req.params.id);
    return res.status(200).json(rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
