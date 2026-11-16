import { readFile } from "node:fs/promises";
import pool from "../config/database.js";

// SQL files are read before connecting, so missing files cannot cause a partial reset.
async function reset() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database reset is disabled in production.");
  }

  let schema;
  let seed;
  try {
    schema = await readFile(
      new URL("../db/schema.sql", import.meta.url),
      "utf8",
    );
    seed = await readFile(new URL("../db/seed.sql", import.meta.url), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        "Reset needs server/db/schema.sql and server/db/seed.sql. Add the database schema and sample data first.",
      );
    }
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(schema);
    await client.query(seed);
    await client.query("COMMIT");
    console.log("Development database reset complete.");
  } catch {
    await client.query("ROLLBACK");
    throw new Error("Database reset failed; changes were rolled back.");
  } finally {
    client.release();
  }
}

try {
  await reset();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
