import model from '../models/kitchenModel.js'

const getKitchen = async (req, res) => {
  try {
    const results = await model.getKitchen(req, res)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const addToKitchen = async (req, res) => {
  try {
    const result = await model.addToKitchen(req, res)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const removeFromKitchen = async (req, res) => {
  try {
    const result = await model.removeFromKitchen(req, res)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default {
  getKitchen,
  addToKitchen,
  removeFromKitchen,
}
