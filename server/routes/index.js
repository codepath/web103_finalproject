import { Router } from "express";
import pool from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";
import authRoutes from "./auth.js";
import tripRoutes from "./trips.js";
import activityRoutes from "./activities.js";
import expenseRoutes from "./expenses.js";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

router.use("/auth", authRoutes);
router.use(requireAuth);

router.use("/trips", tripRoutes);
router.use("/activities", activityRoutes);
router.use("/expenses", expenseRoutes);

export default router;
