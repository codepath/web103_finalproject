import GitHubStrategy from 'passport-github2';
import pool from './database.js';

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/auth/github/callback',
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, login, avatar_url },
  } = profile;

  try {
    const results = await pool.query(
      'SELECT * FROM users WHERE github_id = $1',
      [String(id)]
    );
    const user = results.rows[0];

    if (!user) {
      const newResults = await pool.query(
        `INSERT INTO users (github_id, username, avatar_url)
         VALUES($1, $2, $3)
         RETURNING *`,
        [String(id), login, avatar_url]
      );
      return callback(null, newResults.rows[0]);
    }

    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);
