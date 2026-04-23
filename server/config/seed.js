import pool from "./database.js";

const seedDatabase = async () => {
  try {
    await pool.query(`
      INSERT INTO users (github_id, username, avatar_url, is_admin)
      VALUES
        ('1001', 'anthonyc247', 'https://example.com/avatar1.png', true),
        ('1002', 'abirmahmood6', 'https://example.com/avatar2.png', false);

      INSERT INTO industries (name)
      VALUES
        ('Tech'),
        ('Finance'),
        ('Healthcare');

      INSERT INTO companies (name, website, industry_id)
      VALUES
        ('Meta', 'https://meta.com', 1),
        ('Google', 'https://google.com', 1),
        ('Stripe', 'https://stripe.com', 2);

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
        (1, 1, 'Software Engineer', 'Full-time', 'Menlo Park, CA', 12, '2026-02-15', 8, false, 'Layoff was unexpected but severance helped during the transition.'),
        (2, 2, 'Product Designer', 'Full-time', 'Remote', 10, '2026-01-20', 6, true, 'Team was reduced during restructuring.'),
        (1, 3, 'Data Analyst', 'Contract', 'San Francisco, CA', 6, '2025-12-10', 4, false, 'Contract ended during company cost cutting.'),
        (2, 1, 'Frontend Engineer', 'Full-time', 'Remote', 14, '2026-03-01', 5, true, 'Laid off due to org restructuring, but received strong support from team.'),
        (1, 2, 'Backend Engineer', 'Full-time', 'New York, NY', 8, '2026-02-01', 7, false, 'Unexpected layoff after project cancellation.');
    `);

    console.log("Sample layoff data seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
};

seedDatabase();