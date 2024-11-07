import { pool } from '../database.js'
import '../dotenv.js'
import bookings from '../../mock_data/bookings.js'
const createBookingsTableQuery = `
    DROP TABLE IF EXISTS bookings;
    CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        salon_id INT REFERENCES salons(id),
        employee_id INT REFERENCES employees(id),
        time_slot_id INT REFERENCES time_slots(id)
    );
`

const createBookingsTable = async () => {
  try {
    await pool.query(createBookingsTableQuery)
    console.log('🛠️ bookings table created')
  } catch (error) {
    console.error('⚠️ Error creating bookings table', error)
  }
}

const seedBookingsTable = async () => {
  try {
    await createBookingsTable()
    for (const booking of bookings) {
      const insertQuery = `INSERT INTO bookings (user_id, salon_id, employee_id, time_slot_id) VALUES ($1, $2, $3, $4)`
      const values = [
        booking.user_id,
        booking.salon_id,
        booking.employee_id,
        booking.time_slot_id,
      ]
      await pool.query(insertQuery, values)
      console.log(
        `📅 Booking for user ${booking.user_id} inserted successfully`
      )
    }
  } catch (error) {
    console.error('⚠️ Error seeding bookings table', error)
  }
}

export default {
  seedBookingsTable,
}
