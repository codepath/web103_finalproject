import { Router } from "express";
import { listTasks } from "../controllers/taskController.js";

const taskRouter = Router();

taskRouter.get("/", listTasks);

export default taskRouter;
