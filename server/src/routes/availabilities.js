import express from "express";
import AvailabilitiesController from "../controllers/availabilities.js";

const router = express.Router();

router.get("/:time", AvailabilitiesController.getTimeTutors);
router.post("/", AvailabilitiesController.addTimeTutor);

export default router;
