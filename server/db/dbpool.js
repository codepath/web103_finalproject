import pg from 'pg'
import '../config/dotenv.js'


console.log(`USER: ${process.env.PGUSER}`)

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false
  }
}

export const pool = new pg.Pool(config)
