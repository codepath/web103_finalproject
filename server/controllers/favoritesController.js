import model from '../models/favoritesModel.js'

const getFavorites = async (req, res) => {
  try {
    const response = await model.getFavorites(req, res)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getFavorite = async (req, res) => {
  try {
    const response = await model.getFavorites(req, res)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createFavorite = async (req, res) => {
  try {
    const response = await model.createFavorite(req, res)
    res.status(200).json(response)
    console.log('controller creating favorite')
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// const updateFavorite = async (req, res) => {
//   try {
//     const response = await model.getFavorites(req, res)
//     res.status(200).json(response)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }


const deleteFavorite = async (req, res) => {
  try {
    console.log('del fav controller reached')
    const response = await model.deleteFavorite(req, res)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


export default {
  getFavorites,
  getFavorite,
  createFavorite,
  deleteFavorite,
}
