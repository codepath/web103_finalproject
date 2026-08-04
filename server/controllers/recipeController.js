import model from '../models/recipeModel.js'

const createRecipe = async (req, res) => {
  try {
    const newRecipe = await model.createRecipe(req, res)
    res.status(201).json(newRecipe)

  } catch (err) {
    res.status(500).json({ message: err.message})
  }
}

const getRecipes = async (req, res) => {
  try {
    const results = await model.getRecipes(req, res)
    res.status(201).json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getRecipe = async (req, res) => {
  try {
    const data = await model.getRecipe(req, res)
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getRecipeIngredients = async (req, res) => {
  try {
    const data = await model.getRecipeIngredients(req, res)
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateRecipe = async (req, res) => {
  try {
    const result = await model.updateRecipe(req, res)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteRecipe = async (req, res) => {
  try {
    const result = await model.deleteRecipe(req, res)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default {
  createRecipe,
  getRecipes,
  getRecipe,
  getRecipeIngredients,
  updateRecipe,
  deleteRecipe,
}
