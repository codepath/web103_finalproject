import express from "express";
import SchoolsController from "../controllers/schools.js";

const router = express.Router();

router.get("/", SchoolsController.getSchools);
router.get("/:id", SchoolsController.getSchoolById);

export default router;
