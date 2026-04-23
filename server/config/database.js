import "./dotenv.js";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT)
});

console.log("DB NAME FROM ENV:", process.env.PGDATABASE);
export default pool;