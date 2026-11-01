import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const requiredEnvironmentVariables = [
  "PGUSER",
  "PGPASSWORD",
  "PGHOST",
  "PGPORT",
  "PGDATABASE",
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (variableName) => !process.env[variableName],
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing database environment variables: ${missingEnvironmentVariables.join(", ")}`,
  );
}

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  ssl:
    process.env.NODE_ENV === "production" ||
    process.env.PGHOST.endsWith(".render.com")
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
