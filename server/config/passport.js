import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import pool from "./database.js";
import { validateAuthConfig } from "./auth.js";

const userQuery = `SELECT u.id, u.name, u.email, g.avatar_url AS "avatarUrl"
  FROM users u JOIN user_github_accounts g ON g.user_id = u.id`;

export function configurePassport() {
  validateAuthConfig();
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query(`${userQuery} WHERE u.id = $1`, [id]);
      done(null, rows[0] || false);
    } catch (error) { done(error); }
  });
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    state: true,
  }, async (_accessToken, _refreshToken, profile, done) => {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");
      // Serialize first logins for the same GitHub identity across concurrent requests.
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [profile.id]);
      const existing = await client.query(`${userQuery} WHERE g.github_id = $1`, [profile.id]);
      if (existing.rows[0]) {
        await client.query("COMMIT");
        return done(null, existing.rows[0]);
      }
      // Identity is linked by GitHub ID only, never by an unverified matching email.
      const name = (profile.displayName || profile.username || "GitHub user").trim().slice(0, 100);
      const { rows } = await client.query("INSERT INTO users (name, email) VALUES ($1, NULL) RETURNING id, name, email", [name]);
      const user = rows[0];
      user.avatarUrl = profile.photos?.[0]?.value || null;
      await client.query(`INSERT INTO user_github_accounts (user_id, github_id, username, avatar_url)
        VALUES ($1, $2, $3, $4)`, [user.id, profile.id, profile.username || null, user.avatarUrl]);
      await client.query("COMMIT");
      done(null, user);
    } catch (error) {
      if (client) await client.query("ROLLBACK").catch(() => {});
      done(error);
    } finally { client?.release(); }
  }));
}
export default passport;
