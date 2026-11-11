import {
  getAllTasks,
  getTaskById,
  userExists,
  createTask as insertTask,
  updateTask as modifyTask,
  deleteTask as removeTask,
} from "../models/taskModel.js";
import {
  ValidationError,
  parseTaskId,
  validateCreateTaskInput,
  validateTaskListQuery,
  validateUpdateTaskInput,
} from "../validators/taskValidation.js";

const TASK_NOT_FOUND = { error: "Task not found." };

// Validation failures become 400 responses; anything else is passed to the
// app-level error handler and becomes a 500.
function handleError(error, response, next) {
  if (error instanceof ValidationError) {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
}

export async function listTasks(request, response, next) {
  try {
    const options = validateTaskListQuery(request.query);
    const tasks = await getAllTasks(options);
    response.json(tasks);
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function getTask(request, response, next) {
  try {
    const taskId = parseTaskId(request.params.id);
    const task = await getTaskById(taskId);

    if (!task) {
      return response.status(404).json(TASK_NOT_FOUND);
    }

    response.json(task);
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function createTask(request, response, next) {
  try {
    const taskInput = validateCreateTaskInput(request.body);

    if (!(await userExists(taskInput.user_id))) {
      throw new ValidationError("Task user_id does not match an existing user.");
    }

    const task = await insertTask(taskInput);
    response.status(201).json(task);
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function updateTask(request, response, next) {
  try {
    const taskId = parseTaskId(request.params.id);
    const updates = validateUpdateTaskInput(request.body);
    const task = await modifyTask(taskId, updates);

    if (!task) {
      return response.status(404).json(TASK_NOT_FOUND);
    }

    response.json(task);
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function deleteTask(request, response, next) {
  try {
    const taskId = parseTaskId(request.params.id);
    const deleted = await removeTask(taskId);

    if (!deleted) {
      return response.status(404).json(TASK_NOT_FOUND);
    }

    response.status(204).send();
  } catch (error) {
    handleError(error, response, next);
  }
}
