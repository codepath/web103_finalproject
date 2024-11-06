import pg from "pg";
import dotenv from "dotenv"; 
dotenv.config({path: "../.env"}); 

const config = {
  connectionString: process.env.PG_CONNECTION_STRING,
};

export const pool = new pg.Pool(config);