import pg from 'pg'

// Render's External URL (host ends in .render.com) requires SSL. Its Internal URL
// (host like dpg-xxxx-a, used by the web service on Render) and local Postgres don't.
// pg falls back to PGHOST etc. when DATABASE_URL is unset, so check both.
export const needsSsl = (env) =>
  `${env.DATABASE_URL ?? ''} ${env.PGHOST ?? ''}`.includes('render.com')

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSsl(process.env) ? { rejectUnauthorized: false } : false,
})
