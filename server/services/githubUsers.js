import pool from "../config/database.js";
import { createStarterTrip } from "./starterTrips.js";

const userQuery = `SELECT u.id, u.name, u.email, g.avatar_url AS "avatarUrl"
  FROM users u JOIN user_github_accounts g ON g.user_id = u.id`;

export async function getGitHubUser(id) {
  const { rows } = await pool.query(`${userQuery} WHERE u.id = $1`, [id]);
  return rows[0] || false;
}

export async function findOrCreateGitHubUser(profile, database = pool) {
  const client = await database.connect();
  try {
    await client.query("BEGIN");
    // The same identity's first-login requests must finish one at a time.
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [profile.id]);
    const existing = await client.query(`${userQuery} WHERE g.github_id = $1`, [profile.id]);
    if (existing.rows[0]) {
      await client.query("COMMIT");
      return existing.rows[0];
    }

    // Never attach a GitHub identity to another account just because emails match.
    const name = (profile.displayName?.trim() || profile.username?.trim() || "GitHub user").slice(0, 100);
    const { rows } = await client.query(
      "INSERT INTO users (name, email) VALUES ($1, NULL) RETURNING id, name, email",
      [name],
    );
    const user = rows[0];
    user.avatarUrl = profile.photos?.[0]?.value || null;
    await client.query(
      `INSERT INTO user_github_accounts (user_id, github_id, username, avatar_url)
       VALUES ($1, $2, $3, $4)`,
      [user.id, profile.id, profile.username || null, user.avatarUrl],
    );
    await createStarterTrip(client, user.id);
    await client.query("COMMIT");
    return user;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
