import { Router } from "express";
import { listTasks } from "../controllers/taskController.js";
import { getTask, createTask, updateTask, deleteTask } from "../controllers/taskController.js";


const taskRouter = Router();

taskRouter.get("/", listTasks);

taskRouter.get("/:id", getTask);
taskRouter.post("/", createTask);
taskRouter.patch("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);


export default taskRouter;
