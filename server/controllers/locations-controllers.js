import pool from '../config/database.js'

const getLocations = async (_, res) => {
  try{
    const results = await pool.query('SELECT * FROM locations ORDER BY id ASC')
    res.status(200).json(results.rows)
  } catch (err) {
    console.error('get Locations error: ', err)
    res.status(409).json({error: err})
  }
}

const getLocationById = async (req, res) => {
  try{
    const locationId = req.params.locationId
    const selectQuery = `
      SELECT * FROM locations WHERE locations.id = $1
    `
    const result = await pool.query(selectQuery, [locationId])
    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('get Location by Id error: ', err)
    res.status(409).json({error: err})
  }
}

export default {getLocations, getLocationById}