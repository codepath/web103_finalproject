import { pool } from "./database.js";
import GoogleStrategy from "passport-google-oauth20";

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const verifyCallback = async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, photos } = profile;

  const googleUser = {
    id: id,
    username: displayName,
    email: emails[0].value,
    avatarUrl: photos[0].value,
    accessToken,
  };

  try {
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [googleUser.id]);

    if (userResult.rowCount === 0) {
      const insertUserQuery = `
        INSERT INTO users (id, username, email, avatarurl, accesstoken)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const insertUserValues = [
        googleUser.id,
        googleUser.username,
        googleUser.email,
        googleUser.avatarUrl,
        googleUser.accessToken,
      ];
      const newUserResult = await pool.query(insertUserQuery, insertUserValues);

      const newUser = newUserResult.rows[0];
      return done(null, newUser);
    }

    const user = userResult.rows[0];
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

export const Google = new GoogleStrategy(googleOptions, verifyCallback);
