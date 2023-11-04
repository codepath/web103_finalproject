import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)

const sneakersFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const sneakersData = JSON.parse(sneakersFile)

const createSneakersTable = async () => {
  const createSneakersTableQuery = `
    CREATE TABLE IF NOT EXISTS sneakers (
      id serial PRIMARY KEY,
      brand_name varchar(100) NOT NULL,
      description text NOT NULL,
      sizes numeric(7, 2) NOT NULL,
      price money NOT NULL,
      img_url text NOT NULL
    );
  `
  try {
    const res = await pool.query(createSneakersTableQuery)
    console.log('🎉 sneakers table created successfully')
    }
    catch (err) {
      console.error('⚠️ error creating sneakers table', err)
    }
  }

  const createCommentsTable = async () => {
    const createCommentsTableQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id serial PRIMARY KEY,
        sneaker_id integer NOT NULL,
        comment varchar(100) NOT NULL,
        num_votes integer DEFAULT 0,
        FOREIGN KEY(sneaker_id) REFERENCES sneakers(id)
      );
    `
  
    try {
      const res = await pool.query(createCommentsTableQuery)
      console.log('🎉 comments table created successfully')
    }
    catch (err) {
      console.error('⚠️ error creating comments table', err)
    }
  }
  

const seedSneakersTable = async () => {
    await createSneakersTable()
    
    sneakersData.forEach((sneaker) => {
        const insertQuery = {
        text: 'INSERT INTO sneakers (brand_name, description, sizes, price, img_url) VALUES ($1, $2, $3, $4, $5)'
        }
    
    const values = [
        sneaker.brand_name,
        sneaker.description,
        sneaker.sizes,
        sneaker.price,
        sneaker.img_url
        ]
    
        try {
        pool.query(insertQuery, values)
        console.log(`✅ ${sneaker.brand_name} added successfully`)
        }
        catch (err) {
        console.error('⚠️ error inserting sneaker', err)
        }
    
    })
    }
    
    seedSneakersTable()
    createCommentsTable()
    