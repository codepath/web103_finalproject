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


export async function getTaskById(taskId) {
  const result = await pool.query(
    "SELECT * from tasks WHERE id = $1", [taskId]);
    return result.rows[0]; // undefined if not found
}

//added default values to stop errors when creating a task without all fields.
export async function createTask({
  title,
  description = "",
  priority = "medium",
  due_date = null,
  user_id,
}) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, priority, due_date, user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, priority, due_date, user_id]
  );
  return result.rows[0];
}

// export async function createTask(task) {
//   //const { title, description, priority, due_date, completed, user_id } = task;
//   const result = await pool.query(
//     `INSERT INTO tasks (title, description, priority, due_date, completed, user_id)
//      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//     [title, description, priority, due_date, completed, user_id]
//   );
//   return result.rows[0];
// }

//edit task or update when completed
export async function updateTask(id, { title, description, priority, due_date, completed }) {
  const result = await pool.query(
    `UPDATE tasks
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        priority = COALESCE($3, priority),
        due_date = COALESCE($4, due_date),
        completed = COALESCE($5, completed),
        updated_at = NOW()
    WHERE id = $6
    RETURNING *`,
    [title, description, priority, due_date, completed, id]
  );
  return result.rows[0];
}

//removes task completely from database
export async function deleteTask(id) {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}