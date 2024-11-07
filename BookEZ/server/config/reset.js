import './dotenv.js'
import db from './db_tables/index.js'

const resetTables = async () => {
  await db.usersTable.seedUsersTable()
  await db.salonsTable.seedSalonsTable()
  await db.employeesTable.seedEmployeesTable()
  await db.timeSlotsTable.seedTimeSlotsTable()
  await db.bookingsTable.seedBookingsTable()
  console.log('🌱 Tables seeded')
}

resetTables()
