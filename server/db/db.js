import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    connectionString: process.env.DB_RAILWAY,
    ssl: {
      rejectUnauthorized: false // Required for secure connections
    },
};

export const pool = new pg.Pool(config);
