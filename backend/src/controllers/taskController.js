import { getAllTasks } from "../models/taskModel.js";
import {
  getTaskById,
  createTask as insertTask,
  updateTask as modifyTask,
  deleteTask as removeTask,
} from "../models/taskModel.js";

export async function listTasks(_request, response, next) {
  try {
    const tasks = await getAllTasks();
    response.json(tasks);
  } catch (error) {
    next(error);
  }
}
//finds existing task by id and returns it, if not found returns 404 error
export async function getTask(request, response, next) {
  try {
    const task = await getTaskById(request.params.id);
    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }
    response.json(task);
  } catch (error) {
    next(error);
  }
  
}
//creates a new task, if title or user_id is missing returns 400 error
export async function createTask(request, response, next) {
  try {
    const { title, user_id } = request.body;
    if(!title|| !user_id){
      return response.status(400).json({ error: "Title and user_id are required" });
    }

    const task = await insertTask(request.body);
    response.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

//not technically needed, but added for completeness. 
// Updates an existing task, if not found returns 404 error
export async function updateTask(request, response, next) {
  try {
    const task = await modifyTask(request.params.id, request.body);
    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }
    response.json(task);
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(request, response, next) {
  try {
    const task = await removeTask(request.params.id);
    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}