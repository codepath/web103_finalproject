import { pool } from '../database.js'
import '../dotenv.js'
import salons from '../../mock_data/salons.js'

const createSalonsTableQuery = `
    DROP TABLE IF EXISTS salons CASCADE;
    CREATE TABLE IF NOT EXISTS salons (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT,
        state TEXT,
        zip_code VARCHAR(20),
        phone_number VARCHAR(20),
        email TEXT
    );
`

const createSalonsTable = async () => {
  try {
    await pool.query(createSalonsTableQuery)
    console.log('🛠️ salons table created')
  } catch (error) {
    console.error('⚠️ Error creating salons table', error)
  }
}

const seedSalonsTable = async () => {
  try {
    await createSalonsTable()
    for (const salon of salons) {
      const insertQuery = `INSERT INTO salons (name, address, city, state, zip_code, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7)`
      const values = [
        salon.name,
        salon.address,
        salon.city,
        salon.state,
        salon.zip_code,
        salon.phone_number,
        salon.email,
      ]
      await pool.query(insertQuery, values)
      console.log(`🏢 Salon ${salon.name} inserted successfully`)
    }
  } catch (error) {
    console.error('⚠️ Error seeding salons table', error)
  }
}

export default {
  seedSalonsTable,
}
