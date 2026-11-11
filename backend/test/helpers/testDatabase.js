import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../../config/db.js";

const sqlDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../sql",
);

const [schemaSql, seedSql] = await Promise.all([
  fs.readFile(path.join(sqlDirectory, "schema.sql"), "utf8"),
  fs.readFile(path.join(sqlDirectory, "seed.sql"), "utf8"),
]);

// Extra rows on top of seed.sql so filters and sorting have something to
// distinguish: a completed task with no due date and task-category links.
const fixturesSql = `
  INSERT INTO tasks (user_id, title, description, priority, due_date, completed)
  SELECT id, 'Update resume', 'Add the latest project.', 'low', NULL, TRUE
  FROM users
  WHERE email = 'demo@habitflow.local';

  INSERT INTO task_categories (task_id, category_id)
  SELECT t.id, c.id
  FROM tasks AS t
  JOIN categories AS c ON (
    (t.title = 'Review reading notes' AND c.name IN ('Learning', 'Personal')) OR
    (t.title = 'Plan workout' AND c.name = 'Health') OR
    (t.title = 'Update resume' AND c.name = 'Career')
  );
`;

// Rebuilds the test database from scratch. setup.js guarantees this only
// ever runs against a database whose name ends in "_test".
export async function resetDatabase() {
  await pool.query(`
    DROP TABLE IF EXISTS
      task_categories, categories, habit_completions, habits, tasks, users
    CASCADE
  `);
  await pool.query(schemaSql);
  await pool.query(seedSql);
  await pool.query(fixturesSql);
}

export async function getDemoUserId() {
  const result = await pool.query(
    "SELECT id FROM users WHERE email = 'demo@habitflow.local'",
  );
  return result.rows[0].id;
}

export async function getTaskIdByTitle(title) {
  const result = await pool.query("SELECT id FROM tasks WHERE title = $1", [
    title,
  ]);
  return result.rows[0].id;
}

export { pool };
