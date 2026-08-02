import model from '../models/scheduledMealsModel.js'

const getScheduledMeals = async (req, res) => {
  try {
    const results = await model.getScheduledMeals(req, res)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createScheduledMeal = async (req, res) => {
  try {
    const result = await model.createScheduledMeal(req, res)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteScheduledMeal = async (req, res) => {
  try {
    const result = await model.deleteScheduledMeal(req, res)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default {
  getScheduledMeals,
  createScheduledMeal,
  deleteScheduledMeal,
}
