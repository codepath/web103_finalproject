import { getAllTasks } from "../models/taskModel.js";

export async function listTasks(_request, response, next) {
  try {
    const tasks = await getAllTasks();
    response.json(tasks);
  } catch (error) {
    next(error);
  }
}
