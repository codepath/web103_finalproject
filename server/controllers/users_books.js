import { pool } from '../config/database.js'

const createBookUser = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const { username } = req.body

    const results = await pool.query(`
      INSERT INTO users_trips (trip_id, username)
      VALUES($1, $2)
      RETURNING *`,
      [trip_id, username]
    )

    res.status(200).json(results.rows[0])
    console.log('🆕 added user to trip')
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
    console.log('Error:', error.message)
  }
}

const getTripUsers = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const results = await pool.query(
      'SELECT * FROM users_trips WHERE trip_id = $1',
      [trip_id]
    )

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json( { error: error.message } )
    console.log('🚫 unable to GET all users (travelers) - Error:', error.message)
  }
}

const getUserTrips = async (req, res) => {
  try {
    const username = req.params.username
    const results = await pool.query(`
      SELECT trips.* FROM users_trips, trips
      WHERE users_trips.trip_id = trips.id
      AND users_trips.username = $1`,
      [username]
    )

    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json( { error: error.message } )
    console.log('🚫 unable to GET users trips - Error:', error.message)
  }
}

export default {
  createBookUser,
  getTripUsers,
  getUserTrips
}