import express from "express";

import PropertiesController from "../controllers/properties.js";

const router = express.Router();

router.get("/properties/:userId", PropertiesController.getUserProperties);
router.post("/properties/new/:userId", PropertiesController.postNewProperty);

export default router;
