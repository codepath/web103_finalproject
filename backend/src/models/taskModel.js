import pool from "../../config/db.js";

const TASK_WITH_CATEGORIES_SELECT = `
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
        ORDER BY c.name
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'::json
    ) AS categories
  FROM tasks AS t
  LEFT JOIN task_categories AS tc ON tc.task_id = t.id
  LEFT JOIN categories AS c ON c.id = tc.category_id
`;

const PRIORITY_RANK = `
  CASE t.priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END
`;

// Sort expressions are chosen from this fixed map, never interpolated from input.
const SORT_DEFINITIONS = {
  due_date: { expression: "t.due_date", defaultOrder: "asc", nulls: "NULLS LAST" },
  priority: { expression: PRIORITY_RANK, defaultOrder: "desc", nulls: "" },
  created_at: { expression: "t.created_at", defaultOrder: "desc", nulls: "" },
  title: { expression: "lower(t.title)", defaultOrder: "asc", nulls: "" },
};

function buildOrderBy(sort, order) {
  if (!sort) {
    return "ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC, t.id DESC";
  }

  const definition = SORT_DEFINITIONS[sort];
  const direction = (order ?? definition.defaultOrder) === "asc" ? "ASC" : "DESC";

  return `ORDER BY ${definition.expression} ${direction} ${definition.nulls}, t.id ${direction}`;
}

export async function getAllTasks({ filters = {}, sort, order } = {}) {
  const conditions = [];
  const values = [];

  if (filters.completed !== undefined) {
    values.push(filters.completed);
    conditions.push(`t.completed = $${values.length}`);
  }

  if (filters.priority !== undefined) {
    values.push(filters.priority);
    conditions.push(`t.priority = $${values.length}`);
  }

  // Filter with EXISTS so matching tasks still return all of their categories.
  if (filters.category !== undefined) {
    values.push(filters.category);
    conditions.push(`EXISTS (
      SELECT 1
      FROM task_categories AS filter_tc
      JOIN categories AS filter_c ON filter_c.id = filter_tc.category_id
      WHERE filter_tc.task_id = t.id
        AND lower(filter_c.name) = lower($${values.length})
    )`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `${TASK_WITH_CATEGORIES_SELECT}
     ${whereClause}
     GROUP BY t.id
     ${buildOrderBy(sort, order)}`,
    values,
  );

  return result.rows;
}

export async function getTaskById(taskId) {
  const result = await pool.query(
    `${TASK_WITH_CATEGORIES_SELECT}
     WHERE t.id = $1
     GROUP BY t.id`,
    [taskId],
  );

  return result.rows[0] ?? null;
}

export async function userExists(userId) {
  const result = await pool.query("SELECT 1 FROM users WHERE id = $1", [userId]);
  return result.rowCount > 0;
}

export async function createTask({
  title,
  description,
  priority,
  due_date,
  completed,
  user_id,
}) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, priority, due_date, completed, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [title, description, priority, due_date, completed, user_id],
  );

  return getTaskById(result.rows[0].id);
}

// Only columns present in `updates` are written, so PATCH is partial and
// an explicit null (e.g. due_date) clears the column.
export async function updateTask(taskId, updates) {
  const allowedColumns = ["title", "description", "priority", "due_date", "completed"];
  const assignments = [];
  const values = [];

  for (const column of allowedColumns) {
    if (Object.hasOwn(updates, column)) {
      values.push(updates[column]);
      assignments.push(`${column} = $${values.length}`);
    }
  }

  if (assignments.length === 0) {
    throw new Error("updateTask requires at least one column to update.");
  }

  values.push(taskId);
  const result = await pool.query(
    `UPDATE tasks
     SET ${assignments.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING id`,
    values,
  );

  if (result.rowCount === 0) {
    return null;
  }

  return getTaskById(taskId);
}

export async function deleteTask(taskId) {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);
  return result.rowCount > 0;
}
