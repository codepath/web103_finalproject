import { pool } from '../database.js'
import '../dotenv.js'
import employees from '../../mock_data/employees.js'

const createEmployeesTableQuery = `
    DROP TABLE IF EXISTS employees CASCADE;
    CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        salon_id INT REFERENCES salons(id),
        name TEXT NOT NULL,
        role TEXT
    );
`

const createEmployeesTable = async () => {
  try {
    await pool.query(createEmployeesTableQuery)
    console.log('🛠️ employees table created')
  } catch (error) {
    console.error('⚠️ Error creating employees table', error)
  }
}

const seedEmployeesTable = async () => {
  try {
    await createEmployeesTable()
    for (const employee of employees) {
      const insertQuery = `INSERT INTO employees (salon_id, name, role) VALUES ($1, $2, $3)`
      const values = [employee.salon_id, employee.name, employee.role]
      await pool.query(insertQuery, values)
      console.log(`👤 Employee ${employee.name} inserted successfully`)
    }
  } catch (error) {
    console.error('⚠️ Error seeding employees table', error)
  }
}

export default {
  seedEmployeesTable,
}
