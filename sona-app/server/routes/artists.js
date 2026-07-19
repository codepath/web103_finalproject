import express from "express";
import pool from "../config/database.js";

const router = express.Router();

async function isAdminOf(userId, artistId) {
  const result = await pool.query(
    `SELECT 1 FROM admin WHERE user_id = $1 AND artist_id = $2`,
    [userId, artistId],
  );
  return result.rows.length > 0;
}

router.get("/", async (req, res) => {
  const { q, genre } = req.query;
  const conditions = [];
  const values = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }
  if (genre) {
    values.push(genre);
    conditions.push(`genre = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const result = await pool.query(
      `SELECT * FROM artists ${where} ORDER BY name`,
      values,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch artists" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT artists.*,
              profile.description, profile.instagram, profile.twitter,
              profile.facebook, profile.tiktok, profile.spotify
       FROM artists
       LEFT JOIN profile ON profile.artist_id = artists.id
       WHERE artists.id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch artist" });
  }
});

router.post("/", async (req, res) => {
  const {
    name, genre, photo,
    description, instagram, twitter, facebook, tiktok, spotify,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const artistResult = await client.query(
      `INSERT INTO artists (name, genre, photo)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, genre, photo],
    );
    const artist = artistResult.rows[0];

    await client.query(
      `INSERT INTO profile
         (artist_id, description, instagram, twitter, facebook, tiktok, spotify)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [artist.id, description, instagram, twitter, facebook, tiktok, spotify],
    );

    await client.query("COMMIT");
    res.status(201).json(artist);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to create artist" });
  } finally {
    client.release();
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    user_id,
    name, genre, photo,
    description, instagram, twitter, facebook, tiktok, spotify,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }
  if (!(await isAdminOf(user_id, id))) {
    return res.status(403).json({ error: "Not authorized to edit this artist" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const artistResult = await client.query(
      `UPDATE artists
       SET name  = COALESCE($2, name),
           genre = COALESCE($3, genre),
           photo = COALESCE($4, photo)
       WHERE id = $1
       RETURNING *`,
      [id, name, genre, photo],
    );

    await client.query(
      `UPDATE profile
       SET description = COALESCE($2, description),
           instagram   = COALESCE($3, instagram),
           twitter     = COALESCE($4, twitter),
           facebook    = COALESCE($5, facebook),
           tiktok      = COALESCE($6, tiktok),
           spotify     = COALESCE($7, spotify)
       WHERE artist_id = $1`,
      [id, description, instagram, twitter, facebook, tiktok, spotify],
    );

    await client.query("COMMIT");
    res.json(artistResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to update artist" });
  } finally {
    client.release();
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }
  if (!(await isAdminOf(user_id, id))) {
    return res.status(403).json({ error: "Not authorized to delete this artist" });
  }

  try {
    await pool.query(`DELETE FROM artists WHERE id = $1`, [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete artist" });
  }
});

export default router;
