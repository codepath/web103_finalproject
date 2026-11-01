import pool from "../../config/db.js";

export async function getAllTasks() {
  const result = await pool.query(`
    SELECT
      t.id,
      t.title,
      t.description,
      t.priority,
      t.due_date,
      t.completed,
      t.user_id,
      t.created_at,
      t.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'color', c.color
          )
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::json
      ) AS categories
    FROM tasks AS t
    LEFT JOIN task_categories AS tc ON tc.task_id = t.id
    LEFT JOIN categories AS c ON c.id = tc.category_id
    GROUP BY t.id
    ORDER BY t.due_date NULLS LAST, t.created_at DESC;
  `);

  return result.rows;
}
