export const TASK_PRIORITIES = ["low", "medium", "high"];
export const TASK_SORT_FIELDS = ["due_date", "priority", "created_at", "title"];
export const SORT_ORDERS = ["asc", "desc"];

const MAX_POSTGRES_INTEGER = 2147483647;
const CREATABLE_FIELDS = [
  "title",
  "description",
  "priority",
  "due_date",
  "completed",
  "user_id",
  "category_ids",
];
const UPDATABLE_FIELDS = [
  "title",
  "description",
  "priority",
  "due_date",
  "completed",
  "category_ids",
];
const LIST_QUERY_PARAMETERS = ["completed", "priority", "category", "sort", "order"];

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isValidId(value) {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 && value <= MAX_POSTGRES_INTEGER;
  }

  if (typeof value === "string" && /^[1-9]\d*$/.test(value)) {
    return Number(value) <= MAX_POSTGRES_INTEGER;
  }

  return false;
}

export function parseTaskId(value) {
  if (!isValidId(value)) {
    throw new ValidationError("Task id must be a positive integer.");
  }

  return Number(value);
}

// Accepts only real calendar dates in YYYY-MM-DD format.
export function isValidDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function rejectUnknownFields(body, allowedFields) {
  const unknownFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field),
  );

  if (unknownFields.length > 0) {
    throw new ValidationError(
      `Unknown or read-only field(s): ${unknownFields.join(", ")}.`,
    );
  }
}

function validateTitle(title) {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new ValidationError("Task title is required.");
  }

  return title.trim();
}

function validateDescription(description) {
  if (typeof description !== "string") {
    throw new ValidationError("Task description must be a string.");
  }

  return description;
}

function validatePriority(priority) {
  if (!TASK_PRIORITIES.includes(priority)) {
    throw new ValidationError(
      `Task priority must be one of: ${TASK_PRIORITIES.join(", ")}.`,
    );
  }

  return priority;
}

function validateDueDate(dueDate) {
  if (dueDate === null) {
    return null;
  }

  if (!isValidDateString(dueDate)) {
    throw new ValidationError(
      "Task due_date must be a valid date in YYYY-MM-DD format or null.",
    );
  }

  return dueDate;
}

function validateCompleted(completed) {
  if (typeof completed !== "boolean") {
    throw new ValidationError("Task completed must be true or false.");
  }

  return completed;
}

// category_ids replaces the task's whole category set; [] removes them all.
// Whether each id exists is checked against the database by the controller.
function validateCategoryIds(categoryIds) {
  if (!Array.isArray(categoryIds) || !categoryIds.every(isValidId)) {
    throw new ValidationError(
      "Task category_ids must be an array of positive integer ids.",
    );
  }

  return [...new Set(categoryIds.map(Number))];
}

const FIELD_VALIDATORS = {
  title: validateTitle,
  description: validateDescription,
  priority: validatePriority,
  due_date: validateDueDate,
  completed: validateCompleted,
  category_ids: validateCategoryIds,
};

export function validateCreateTaskInput(body) {
  if (!isPlainObject(body)) {
    throw new ValidationError("Request body must be a JSON object.");
  }

  rejectUnknownFields(body, CREATABLE_FIELDS);

  if (!isValidId(body.user_id)) {
    throw new ValidationError("Task user_id must be a positive integer.");
  }

  const task = {
    title: validateTitle(body.title),
    description: "",
    priority: "medium",
    due_date: null,
    completed: false,
    user_id: Number(body.user_id),
    category_ids: [],
  };

  for (const field of ["description", "priority", "due_date", "completed", "category_ids"]) {
    if (body[field] !== undefined) {
      task[field] = FIELD_VALIDATORS[field](body[field]);
    }
  }

  return task;
}

// Returns only the fields present in the body so PATCH stays partial.
// A due_date of null is kept so callers can clear it intentionally.
export function validateUpdateTaskInput(body) {
  if (!isPlainObject(body)) {
    throw new ValidationError("Request body must be a JSON object.");
  }

  rejectUnknownFields(body, UPDATABLE_FIELDS);

  const updates = {};

  for (const field of UPDATABLE_FIELDS) {
    if (body[field] !== undefined) {
      updates[field] = FIELD_VALIDATORS[field](body[field]);
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError(
      `Provide at least one field to update: ${UPDATABLE_FIELDS.join(", ")}.`,
    );
  }

  return updates;
}

function readSingleQueryValue(query, name) {
  const value = query[name];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`Query parameter "${name}" must be provided once.`);
  }

  return value;
}

export function validateTaskListQuery(query) {
  rejectUnknownQueryParameters(query);

  const filters = {};

  const completed = readSingleQueryValue(query, "completed");
  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      throw new ValidationError('Query parameter "completed" must be true or false.');
    }
    filters.completed = completed === "true";
  }

  const priority = readSingleQueryValue(query, "priority");
  if (priority !== undefined) {
    filters.priority = validatePriority(priority);
  }

  const category = readSingleQueryValue(query, "category");
  if (category !== undefined) {
    if (category.trim().length === 0) {
      throw new ValidationError('Query parameter "category" must not be empty.');
    }
    filters.category = category.trim();
  }

  const sort = readSingleQueryValue(query, "sort");
  if (sort !== undefined && !TASK_SORT_FIELDS.includes(sort)) {
    throw new ValidationError(
      `Query parameter "sort" must be one of: ${TASK_SORT_FIELDS.join(", ")}.`,
    );
  }

  const order = readSingleQueryValue(query, "order");
  if (order !== undefined) {
    if (!SORT_ORDERS.includes(order)) {
      throw new ValidationError('Query parameter "order" must be asc or desc.');
    }
    if (sort === undefined) {
      throw new ValidationError('Query parameter "order" requires "sort".');
    }
  }

  return { filters, sort, order };
}

function rejectUnknownQueryParameters(query) {
  const unknownParameters = Object.keys(query).filter(
    (name) => !LIST_QUERY_PARAMETERS.includes(name),
  );

  if (unknownParameters.length > 0) {
    throw new ValidationError(
      `Unknown query parameter(s): ${unknownParameters.join(", ")}. ` +
        `Supported: ${LIST_QUERY_PARAMETERS.join(", ")}.`,
    );
  }
}
