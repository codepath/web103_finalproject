import pool from "./database.js";

export async function runReset() {
  await pool.query("BEGIN");

  try {
    await pool.query(`
      DROP TABLE IF EXISTS entries CASCADE;
      DROP TABLE IF EXISTS companies CASCADE;
      DROP TABLE IF EXISTS industries CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        github_id VARCHAR NOT NULL,
        username VARCHAR NOT NULL,
        avatar_url VARCHAR,
        is_admin BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
      );

      CREATE TABLE industries (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE
      );

      CREATE TABLE companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE,
        website VARCHAR,
        industry_id INT REFERENCES industries(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
      );

      CREATE TABLE entries (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        company_id INT NOT NULL REFERENCES companies(id),
        role VARCHAR NOT NULL,
        job_type VARCHAR NOT NULL,
        location VARCHAR,
        severance_weeks INT NOT NULL,
        layoff_date DATE NOT NULL,
        job_search_weeks INT,
        is_anonymous BOOLEAN NOT NULL DEFAULT false,
        summary TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
      );
    `);

    await pool.query(`
      INSERT INTO industries (name)
      VALUES
        ('Technology'),
        ('Finance'),
        ('Healthcare');
    `);

    await pool.query(`
      INSERT INTO users (github_id, username, avatar_url, is_admin)
      VALUES
        ('github_anthonyc247', 'anthonyc247', NULL, true),
        ('github_abirmahmood6', 'abirmahmood6', NULL, false);
    `);

    await pool.query(`
      INSERT INTO companies (name, website, industry_id)
      VALUES
        ('Meta', 'https://meta.com', 1),
        ('Google', 'https://google.com', 1),
        ('Stripe', 'https://stripe.com', 2);
    `);

    await pool.query(`
      INSERT INTO entries (
        user_id,
        company_id,
        role,
        job_type,
        location,
        severance_weeks,
        layoff_date,
        job_search_weeks,
        is_anonymous,
        summary
      )
      VALUES
        (
          1,
          1,
          'Software Engineer',
          'Full-time',
          'Menlo Park, CA',
          12,
          '2026-02-15',
          8,
          false,
          'Layoff was unexpected but severance helped during the transition.'
        ),
        (
          2,
          2,
          'Product Designer',
          'Full-time',
          'Remote',
          10,
          '2026-01-20',
          6,
          true,
          'Team was reduced during restructuring.'
        ),
        (
          1,
          3,
          'Backend Engineer',
          'Contract',
          'New York, NY',
          8,
          '2026-02-01',
          7,
          false,
          'Unexpected layoff after project cancellation.'
        );
    `);

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}