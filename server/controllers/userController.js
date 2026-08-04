import model from '../models/userModel.js'

const getUsers = async (req, res) => {
  try {
    const response = await model.getUsers(req, res)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getUser = async (req, res) => {
  try {
    const response = await model.getUser(req, res)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createUser = async (req, res) => {
  try {
    const response = model.getUser(req, res)
    res.status(201).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const response = await model.updateUser(req, res)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const response = await model.deleteUser(req, res)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createPreference = async (req, res) => {
  try {
    const response = await model.updateDietaryPreferences(req, res)
    res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}


export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  createPreference,
}
