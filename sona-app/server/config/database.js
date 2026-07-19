import pg from "pg";
import "./dotenv.js";

const { Pool } = pg;

const isLocalhost =
  process.env.PGHOST === "localhost" || process.env.PGHOST === "127.0.0.1";

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

export default pool;
