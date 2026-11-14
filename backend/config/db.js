
import pg from "pg";
import dotenv from "dotenv";
import { AsyncLocalStorage } from "node:async_hooks";

dotenv.config();

// Return PostgreSQL dates as YYYY-MM-DD strings.
pg.types.setTypeParser(1082, (value) => value);

// Return numeric values as JavaScript numbers.
pg.types.setTypeParser(1700, (value) =>
  parseFloat(value)
);

// Connect to PostgreSQL.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Store the authenticated user for each request.
export const requestContext =
  new AsyncLocalStorage();

// Get the current logged-in user's ID.
export function getUserId() {
  const id = requestContext.getStore()?.userId;

  if (!Number.isInteger(id) || id < 1) {
    throw new Error(
      "Authenticated user required."
    );
  }

  return id;
}
