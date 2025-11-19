import { Router } from "express";
import { pool } from "../config/database.js";

const r = Router();

// helper to get demo user's id
async function getDemoUserId() {
  const demo = await pool.query(
    "SELECT id, points FROM users WHERE username = 'demo' LIMIT 1"
  );
  if (demo.rows.length === 0) {
    throw new Error("demo user not found");
  }
  return demo.rows[0];
}

// List all stickers for sale
r.get("/stickers", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, price, image_url
      FROM stickers
      ORDER BY price ASC, id ASC
    `);
    res.json(rows);
  } catch (e) {
    console.error("Error fetching stickers:", e);
    res.status(500).json({ error: e.message });
  }
});

// List stickers the user has purchased
r.get("/user-stickers", async (_req, res) => {
  try {
    const { id: userId } = await getDemoUserId();

    const { rows } = await pool.query(
      `
      SELECT s.id, s.name, s.price, s.image_url
      FROM user_stickers us
      JOIN stickers s ON s.id = us.sticker_id
      WHERE us.user_id = $1
      ORDER BY s.price ASC, s.id ASC
      `,
      [userId]
    );

    res.json(rows);
  } catch (e) {
    console.error("Error fetching user stickers:", e);
    res.status(500).json({ error: e.message });
  }
});

// Purchase a sticker (associate to user + deduct points)
r.post("/user-stickers", async (req, res) => {
  const { sticker_id } = req.body;

  if (!sticker_id) {
    return res.status(400).json({ error: "sticker_id required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // demo user
    const demo = await client.query(
      "SELECT id, points FROM users WHERE username = 'demo' LIMIT 1"
    );
    if (demo.rows.length === 0) {
      throw new Error("demo user not found");
    }
    const userId = demo.rows[0].id;
    const currentPoints = demo.rows[0].points ?? 0;

    // sticker price
    const sRes = await client.query(
      "SELECT id, price FROM stickers WHERE id = $1",
      [sticker_id]
    );
    if (sRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Sticker not found" });
    }
    const price = sRes.rows[0].price;

    // already own it?
    const ownRes = await client.query(
      "SELECT 1 FROM user_stickers WHERE user_id = $1 AND sticker_id = $2",
      [userId, sticker_id]
    );
    if (ownRes.rows.length > 0) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ error: "You already own this sticker.", remainingPoints: currentPoints });
    }

    // enough points?
    if (currentPoints < price) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ error: "Not enough points to buy this sticker.", remainingPoints: currentPoints });
    }

    // deduct points
    const updatedUser = await client.query(
      `
      UPDATE users
      SET points = points - $1
      WHERE id = $2
      RETURNING points
      `,
      [price, userId]
    );
    const remainingPoints = updatedUser.rows[0].points;

    // give sticker
    await client.query(
      `
      INSERT INTO user_stickers (user_id, sticker_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [userId, sticker_id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      ok: true,
      sticker_id,
      remainingPoints,
    });
  } catch (e) {
    console.error("Error purchasing sticker:", e);
    try {
      await client.query("ROLLBACK");
    } catch {}
    res.status(500).json({ error: "Purchase failed" });
  } finally {
    client.release();
  }
});

export default r;
