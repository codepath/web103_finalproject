import express from "express";
import pool from "../config/database.js";

const router = express.Router();

export async function isAdminOf(userId, artistId) {
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
      `SELECT artists.*,
              profile.description, profile.instagram, profile.twitter,
              profile.facebook, profile.tiktok, profile.spotify
       FROM artists
       LEFT JOIN profile ON profile.artist_id = artists.id
       ${where}
       ORDER BY artists.name`,
      values,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch artists" });
  }
});

// GET /api/artists/:id/merch
router.get('/:id/merch', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM merch WHERE artist_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch artist merch' });
  }
});

// POST /api/artists/:id/merch
router.post('/:id/merch', async (req, res) => {
  try {
    const artistId = req.params.id;
    const { user_id, name, type, price, photo, stock } = req.body;

    if (!user_id) return res.status(400).json({ error: 'user_id is required' });

    if (!(await isAdminOf(user_id, artistId))) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (!name || !type || price === undefined) {
      return res.status(400).json({ error: 'name, type, and price are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO merch (artist_id, name, type, price, photo, stock)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [artistId, name, type, price, photo, stock ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create merch' });
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

router.get("/:id/posts", async (req, res) => {
  const {id} = req.params;

  try {
    const postResult = await pool.query(
      `SELECT posts.id AS post_id,
              artists.id AS artist_id,
              artists.name AS artist_name,
              posts.content,
              posts.created_at AS posted_on
      FROM artists
      JOIN posts ON artists.id = posts.artist_id
      WHERE artist_id = $1
      ORDER BY posts.created_at DESC`,
      [id]
    )
    res.json(postResult.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch posts" });
  }
})

router.post('/:id/posts', async (req, res) => {
    const {user_id, artist_id, content} = req.body;

    if (!artist_id || !content) {
        return res.status(400).json({error: 'artist_id and content is required'})
    }

    if (!(await isAdminOf(user_id, artist_id))) {
        return res.status(403).json({ error: "Not authorized to create a post this artist" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO posts (artist_id, content)
            VALUES ($1, $2)
            RETURNING *`,
            [artist_id, content]
        )
        res.status(201).json(result.rows[0])
        console.log("new post submitted")
    } catch (err) {
        res.status(500).json({error: "Failed to upload post"})
    }
})

export default router;
