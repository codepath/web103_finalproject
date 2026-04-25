import pg from "pg";
import "dotenv/config";

const { Client } = pg;

console.log({
  DBHOST: process.env.DBHOST,
  DBUSER: process.env.DBUSER,
  DBPASSWORD: process.env.DBPASSWORD ? "loaded" : "missing",
  DBNAME: process.env.DBNAME,
  DBPORT: process.env.DBPORT,
});

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
