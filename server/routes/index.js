import { Router } from "express";
import pool from "../config/database.js";
import actingUser from "../middleware/actingUser.js";
import tripRoutes from "./trips.js";
import activityRoutes from "./activities.js";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

router.get("/users", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT id, name FROM users ORDER BY id");
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.use(actingUser);
router.use("/trips", tripRoutes);
router.use("/activities", activityRoutes);

export default router;
