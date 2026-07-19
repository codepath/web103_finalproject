import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, artist_id, notify_on_release = false } = req.body;

  if (!user_id || !artist_id) {
    return res.status(400).json({ error: "user_id and artist_id are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO follows (user_id, artist_id, notify_on_release)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, artist_id)
       DO UPDATE SET notify_on_release = EXCLUDED.notify_on_release
       RETURNING *`,
      [user_id, artist_id, notify_on_release],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to follow artist" });
  }
});

router.delete("/:artistId", async (req, res) => {
  const { artistId } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    await pool.query(
      `DELETE FROM follows WHERE user_id = $1 AND artist_id = $2`,
      [user_id, artistId],
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unfollow artist" });
  }
});

export default router;
