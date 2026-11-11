import { Router } from "express";
import { listCategories } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.get("/", listCategories);

export default categoryRouter;
