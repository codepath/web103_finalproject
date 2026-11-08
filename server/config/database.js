import "./env.js";
import pg from "pg";

// Return BIGINT ids as numbers, DATE columns as "YYYY-MM-DD" strings and NUMERIC columns as numbers.
pg.types.setTypeParser(20, (value) => Number(value));
pg.types.setTypeParser(1082, (value) => value);
pg.types.setTypeParser(1700, (value) => Number(value));

const isLocal = ["localhost", "127.0.0.1", "::1"].includes(process.env.PGHOST);

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  // Hosted databases (such as Render) require TLS; a local database usually does not.
  ssl: isLocal ? false : { rejectUnauthorized: false },
};

const pool = new pg.Pool(config);
export default pool;
