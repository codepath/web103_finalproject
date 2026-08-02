// Connects my env variables via process.env
// Without it, process.env.DATABASE_URL would just be undefined — Node doesn't automatically read .env files. dotenv.config() is what bridges the gap between the file and your code

import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });
