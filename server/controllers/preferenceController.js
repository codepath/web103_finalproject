import model from '../models/preferenceModel.js'

const createPreference = async (req, res) => {
  try {
    const response = await model.createPreference(req, res) 
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getPreferences = async (req, res) => {
  try {
    const response = await model.getPreferences(req, res) 
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getPreference = async (req, res) => {
  try {
    const response = await model.getPreferencec(req, res) 
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deletePreference = async (req, res) => {
  try {
    const response = await model.deletePreference(req, res) 
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default {
  createPreference,
  getPreferences,
  getPreference,
  deletePreference,
}


