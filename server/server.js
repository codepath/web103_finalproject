// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool as db } from "./config/database.js";
import { initDb } from "./db/init.js";
import storeRoutes from "./routes/storeRoutes.js";
import "dotenv/config";


const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ===== HABITS CRUD =====

// GET all habits
app.get("/api/habits", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, user_id, title, description FROM habits ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

// CREATE habit
app.post("/api/habits", async (req, res) => {
  const { title, description, user_id } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const effectiveUserId = user_id ?? 1; // demo user id

  try {
    const result = await db.query(
      `INSERT INTO habits (user_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, title, description`,
      [effectiveUserId, title.trim(), description || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating habit:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET single habit by id
app.get("/api/habits/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, user_id, title, description FROM habits WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching habit:", err);
    res.status(500).json({ error: "Failed to fetch habit" });
  }
});

// DELETE habit
app.delete("/api/habits/:id", async (req, res) => {
  const { id } = req.params;
  console.log("DELETE /api/habits", id);

  try {
    const result = await db.query("DELETE FROM habits WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      console.log("No habit found to delete for id:", id);
      return res.status(404).json({ error: "Habit not found" });
    }

    return res.status(204).end();
  } catch (err) {
    console.error("Error deleting habit:", err);
    return res.status(500).json({ error: "Failed to delete habit" });
  }
});

// ===== TIMER COMPLETE -> POINTS =====

app.post("/api/habits/:id/complete", async (req, res) => {
  const habitId = req.params.id;
  const { minutes } = req.body;

  const userId = 1; // demo user

  console.log("complete called for habit", habitId, "minutes:", minutes);

  try {
    const pointsEarned = Number(minutes) || 0;
    if (pointsEarned <= 0) {
      return res
        .status(400)
        .json({ error: "Timer minutes must be a positive number." });
    }

    // habit must exist
    const habitResult = await db.query(
      "SELECT id FROM habits WHERE id = $1",
      [habitId]
    );
    if (habitResult.rows.length === 0) {
      console.log("Habit not found for id:", habitId);
      return res.status(404).json({ error: "Habit not found" });
    }

    // update user points
    const userResult = await db.query(
      "UPDATE users SET points = COALESCE(points, 0) + $1 WHERE id = $2 RETURNING points",
      [pointsEarned, userId]
    );

    if (userResult.rows.length === 0) {
      console.log("User not found for id:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const totalPoints = userResult.rows[0].points;

    return res.json({ pointsEarned, totalPoints });
  } catch (err) {
    console.error("Error completing habit:", err);
    return res.status(500).json({ error: "Failed to complete habit" });
  }
});

// ===== STICKER STORE ROUTES =====
app.use("/api", storeRoutes);

// ===== START SERVER AFTER DB INIT =====

async function start() {
  try {
    await initDb(); // ensures tables + demo user
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Fatal startup error:", err);
    process.exit(1);
  }
}

start();
