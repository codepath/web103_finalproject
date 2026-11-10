import { pool } from "./database.js";
import GitHubStrategy from "passport-github2";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback",
};

const verify = async (accessToken, refreshToken, profile, callback) => {
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
    const results = await pool.query(`
      SELECT * FROM Users
      WHERE github_id = $1
    `, [userData.githubId]);
    const user = results.rows[0];

    //create new user and reading list if registering an account
    if (!user) {
      const results = await pool.query(`
        INSERT INTO Users (github_id, username, avatar_url, access_token)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [userData.githubId, userData.username, userData.avatarUrl, accessToken]);

      const newUser = results.rows[0];
      const userId = newUser.id;

      await pool.query("INSERT INTO ReadingLists (user_id) VALUES ($1)", [userId]);
      return callback(null, newUser);
    }

    //update everytime they login again in case they updated profile pic, username. also update access_token
    const updated = await pool.query(`
      UPDATE users
      SET username = $1, avatar_url = $2, access_token = $3
      WHERE id = $4
      RETURNING *
    `, [userData.username, userData.avatarUrl, accessToken, user.id]);

    return callback(null, updated.rows[0]);

  } catch (error) {
    return callback(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);