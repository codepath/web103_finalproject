import { pool } from '../database.js'
import '../dotenv.js'
import timeSlots from '../../mock_data/time_slots.js'

const createTimeSlotsTableQuery = `
    DROP TABLE IF EXISTS time_slots CASCADE;
    CREATE TABLE IF NOT EXISTS time_slots (
        id SERIAL PRIMARY KEY,
        employee_id INT REFERENCES employees(id),
        is_booked BOOLEAN DEFAULT FALSE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL
    );
`

const createTimeSlotsTable = async () => {
  try {
    await pool.query(createTimeSlotsTableQuery)
    console.log('🛠️ time_slots table created')
  } catch (error) {
    console.error('⚠️ Error creating time_slots table', error)
  }
}

const seedTimeSlotsTable = async () => {
  try {
    await createTimeSlotsTable()
    for (const slot of timeSlots) {
      const insertQuery = `INSERT INTO time_slots (employee_id, is_booked, start_time, end_time) VALUES ($1, $2, $3, $4)`
      const values = [
        slot.employee_id,
        slot.is_booked,
        slot.start_time,
        slot.end_time,
      ]
      await pool.query(insertQuery, values)
      console.log(
        `⏰ Time slot for employee ${slot.employee_id} inserted successfully`
      )
    }
  } catch (error) {
    console.error('⚠️ Error seeding time_slots table', error)
  }
}

export default {
  seedTimeSlotsTable,
}
