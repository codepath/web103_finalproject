import { readFile } from "node:fs/promises";
import pool from "../config/database.js";
try {
  const sql = await readFile(
    new URL("../db/migrations/001_google_auth.sql", import.meta.url),
    "utf8",
  );
  await pool.query(sql);
  console.log("Google authentication migration complete.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
