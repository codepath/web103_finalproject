import { pool } from "./database.js";
import GitHubStrategy from "passport-github2";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //callbackURL: 'http://localhost:3001/auth/github/callback'
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  console.log(profile);
  console.log(accessToken);
  const {
    _json: { id, name, login, avatar_url },
  } = profile;

  const userData = {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken,
  };

  try {
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userData.githubId]);

    if (userResult.rowCount === 0) {
      const insertUserQuery = `
        INSERT INTO users (google_id, username, avatarurl, access_token, is_admin)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const insertUserValues = [
        userData.githubId,
        userData.username,
        userData.avatarUrl,
        userData.accessToken,
        false,
      ];
      const newUserResult = await pool.query(insertUserQuery, insertUserValues);

      const newUser = newUserResult.rows[0];
      return callback(null, newUser);
    }

    const user = userResult.rows[0];
    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
};
export const GitHub = new GitHubStrategy(options, verify);
