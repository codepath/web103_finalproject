import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// Return DATE columns as plain YYYY-MM-DD strings (avoids timezone shifts)
pg.types.setTypeParser(1082, (v) => v);
// Return NUMERIC columns as numbers
pg.types.setTypeParser(1700, (v) => parseFloat(v));

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Seeded demo user; authentication is not part of the baseline features
export const USER_ID = 1;
