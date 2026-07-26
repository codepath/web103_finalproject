import express from "express";
import pool from "../config/database.js";
import { isAdminOf } from "./artists.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT posts.id,
                    artists.name AS artist_name,
                    posts.artist_id,
                    posts.content,
                    posts.created_at AS posted_on
            FROM artists
            JOIN posts ON posts.artist_id = artists.id
            WHERE posts.id = $1
            ORDER BY posts.created_at DESC`,
      [id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, artist_id, content } = req.body;

  if (!artist_id || !content) {
    return res.status(400).json({ error: "artist_id and content is required" });
  }

  if (!(await isAdminOf(user_id, artist_id))) {
    return res
      .status(403)
      .json({ error: "Not authorized to edit a post this artist" });
  }

  try {
    const result = await pool.query(
      `UPDATE posts
            SET artist_id = $1,
                content = $2
            WHERE id = $3
            RETURNING *`,
      [artist_id, content, id],
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, artist_id } = req.body;

  if (!(await isAdminOf(user_id, artist_id))) {
    return res
      .status(403)
      .json({ error: "Not authorized to delete a post this artist" });
  }

  try {
    const result = await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
