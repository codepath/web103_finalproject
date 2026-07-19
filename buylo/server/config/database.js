import pg from "pg";
import "dotenv/config";

const { Client } = pg;

export const client = new Client({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  port: Number(process.env.DBPORT),
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Database connected successfully.");
} catch (error) {
  console.error("Error connecting to Database.", error);
}
