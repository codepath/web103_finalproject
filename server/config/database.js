import pg from 'pg';

const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: false //{
    //  rejectUnauthorized: false
    // }
};

export const pool = new pg.Pool(config);
