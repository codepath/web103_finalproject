import express from "express";
import SubjectsController from "../controllers/subjects.js";

const router = express.Router();

router.get("/", SubjectsController.getSubjects);
router.get("/:id", SubjectsController.getSubjectById);

export default router;
