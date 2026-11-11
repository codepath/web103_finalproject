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

export async function allCategoriesExist(categoryIds) {
  if (categoryIds.length === 0) {
    return true;
  }

  const result = await pool.query(
    "SELECT COUNT(*)::int AS count FROM categories WHERE id = ANY($1::int[])",
    [categoryIds],
  );
  return result.rows[0].count === categoryIds.length;
}

async function replaceTaskCategories(client, taskId, categoryIds) {
  await client.query("DELETE FROM task_categories WHERE task_id = $1", [taskId]);

  if (categoryIds.length > 0) {
    await client.query(
      `INSERT INTO task_categories (task_id, category_id)
       SELECT $1, unnest($2::int[])`,
      [taskId, categoryIds],
    );
  }
}

// Runs `work` inside a transaction so a task and its category links are
// saved together or not at all.
async function inTransaction(work) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function createTask({
  title,
  description,
  priority,
  due_date,
  completed,
  user_id,
  category_ids = [],
}) {
  const taskId = await inTransaction(async (client) => {
    const result = await client.query(
      `INSERT INTO tasks (title, description, priority, due_date, completed, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [title, description, priority, due_date, completed, user_id],
    );
    const newTaskId = result.rows[0].id;

    await replaceTaskCategories(client, newTaskId, category_ids);
    return newTaskId;
  });

  return getTaskById(taskId);
}

// Only columns present in `updates` are written, so PATCH is partial and
// an explicit null (e.g. due_date) clears the column. `category_ids`, when
// present, replaces the task's categories.
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

  const hasCategories = Object.hasOwn(updates, "category_ids");

  if (assignments.length === 0 && !hasCategories) {
    throw new Error("updateTask requires at least one field to update.");
  }

  values.push(taskId);

  const found = await inTransaction(async (client) => {
    const result = await client.query(
      `UPDATE tasks
       SET ${[...assignments, "updated_at = NOW()"].join(", ")}
       WHERE id = $${values.length}
       RETURNING id`,
      values,
    );

    if (result.rowCount === 0) {
      return false;
    }

    if (hasCategories) {
      await replaceTaskCategories(client, taskId, updates.category_ids);
    }
    return true;
  });

  return found ? getTaskById(taskId) : null;
}

export async function deleteTask(taskId) {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);
  return result.rowCount > 0;
}
