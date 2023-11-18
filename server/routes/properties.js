import express from "express";

import PropertiesController from "../controllers/properties.js";

const router = express.Router();

router.get("/:userId", PropertiesController.getUserProperties);
router.get("/view/:propertyId", PropertiesController.getPropertyById);
router.post("/new/:userId", PropertiesController.postNewProperty);

export default router;
