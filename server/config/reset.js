import pool from "./database.js";
import { runReset } from "./runReset.js";

const resetDatabase = async () => {
  try {
    await runReset();
    console.log("Database reset and seeded successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await pool.end();
  }
};

resetDatabase();