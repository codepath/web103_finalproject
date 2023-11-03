import pool from '../config/database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const data = fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf8')
//console.log(data);
const dropAllTables = async () => {
  try {
    const dropTableQuery = `
      DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS gifts;
      DROP TABLE IF EXISTS trips_users;
      DROP TABLE IF EXISTS trips_destinations;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS destinations;
      DROP TABLE IF EXISTS trips;
      
      
    `
    await pool.query(dropTableQuery)
  } catch (error) {
    console.log(error)
  }
}
const createCarsTable = async () => {
  try {
    const createTableQuery = `
      DROP TABLE IF EXISTS cars;
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        owner VARCHAR(255) NOT NULL,
        convertible BOOLEAN NOT NULL,
        exterior VARCHAR(255) NOT NULL,
        wheels VARCHAR(255) NOT NULL,
        roof VARCHAR(255) NOT NULL,
        interior VARCHAR(255) NOT NULL
      )
    `
    await pool.query(createTableQuery)
  } catch (error) {
    console.log(error)
  }
}

const insertCars = async () => {
  try {
    const insertQuery = `
      INSERT INTO cars ( owner, convertible, exterior, wheels, roof, interior)
      VALUES ($1, $2, $3, $4, $5, $6)
    `

    const cars = JSON.parse(data)

    for (let car of cars) {
      const values = [
        
        car.owner,
        car.convertible,
        car.exterior,
        car.wheels,
        car.roof,
        car.interior
      ]
      
      await pool.query(insertQuery, values)
      console.log(`✅ added ${car.owner}`)
    }
  } catch (error) {
    console.log(error)
  }
}

const setup = async () => {
  await dropAllTables()
  //await createCarsTable()
  //await insertCars()
}

export default setup