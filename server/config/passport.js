import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./database.js";
import { validateAuthConfig } from "./auth.js";

export function configurePassport() {
  validateAuthConfig();
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const existing = await pool.query(
            "SELECT id, name, email FROM users WHERE google_id = $1",
            [profile.id],
          );
          if (existing.rowCount) return done(null, existing.rows[0]);
          const email = profile.emails?.find((entry) => entry.verified)?.value;
          if (!email) return done(null, false, { code: "email" });
          // Email collisions require explicit account linking; never claim an existing account.
          const result = await pool.query(
            `
        INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING RETURNING id, name, email
      `,
            [
              profile.id,
              (profile.displayName || email).slice(0, 100),
              email.toLowerCase(),
            ],
          );
          if (result.rowCount) return done(null, result.rows[0]);
          const concurrent = await pool.query(
            "SELECT id, name, email FROM users WHERE google_id = $1",
            [profile.id],
          );
          return done(null, concurrent.rows[0] || false, { code: "account" });
        } catch (error) {
          done(error);
        }
      },
    ),
  );
}
export default passport;
