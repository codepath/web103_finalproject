import models from '../models/ingredientsModel.js'

const createIngredient = async (req, res) => {
  // console.log("creteIngredient ++")
  try {
    const newIngredient = await models.createIngredient(req.body)
    res.status(201).json(newIngredient)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getIngredients = async (req, res) => {
  try {
    const ingredients = await models.getIngredients(req, res)
    res.status(200).json(ingredients)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getIngredient = async (req, res) => {
  try {
    const ingredient = await models.getIngredient(req)
    res.status(200).json(ingredient)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateIngredient = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const updatedIngredient = await models.updateIngredient(id, data)
    res.status(201).json(updatedIngredient)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default {
  createIngredient,
  getIngredients,
  getIngredient,
  updateIngredient,
}
