import pool from '../config/database.js'

const getClubs = async (_, res) => {
  try {

  } catch (err) {
    console.error('get Clubs error: ', err)
    res.status(409).json({error: err})
  }
}

const getClubById = async (_, res) => {
  try {

  } catch (err) {
    console.error('get Club by Id error: ', err)
    res.status(409).json({error: err})
  }
}

export default {getClubs, getClubById}