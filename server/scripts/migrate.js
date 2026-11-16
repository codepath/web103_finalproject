import { readFile } from "node:fs/promises";
import pool from "../config/database.js";
let client;
try {
  const sql = await readFile(new URL("../db/migrations/002_github_auth.sql", import.meta.url), "utf8");
  client = await pool.connect();
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("GitHub authentication migration complete.");
} catch (error) {
  if (client) await client.query("ROLLBACK").catch(() => {});
  console.error("GitHub migration failed; changes rolled back.", { code: error.code });
  process.exitCode = 1;
} finally {
  client?.release();
  await pool.end();
}
