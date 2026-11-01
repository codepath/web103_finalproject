import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../config/db.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const sqlFileName = process.argv[2];

if (!sqlFileName || !["schema.sql", "seed.sql"].includes(sqlFileName)) {
  throw new Error("Usage: node scripts/runSql.js <schema.sql|seed.sql>");
}

const sqlFilePath = path.resolve(currentDirectory, "../sql", sqlFileName);
const sql = await fs.readFile(sqlFilePath, "utf8");

try {
  await pool.query(sql);
  console.log(`Executed ${sqlFileName}`);
} finally {
  await pool.end();
}
