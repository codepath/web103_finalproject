import { pool } from './database.js';
import GithubStrategy from 'passport-github2';
import passport from 'passport';

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // callbackURL: process.env.GITHUB_CALLBACK_URL,
  // callbackURL: process.env.NODE_ENV === 'production'
  //   ? process.env.GITHUB_CALLBACK_URL
  //   : 'http://localhost:3001/auth/github/callback',
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://codefm-production.up.railway.app/auth/github/callback'
    : process.env.GITHUB_CALLBACK_URL,
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  console.log('Access Token:', accessToken);
  console.log('Profile:', profile);
  const { id, login, avatar_url } = profile._json;
  

  if (!login) {
    return callback(new Error('Username is required'), null);
  }

  const userData = {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken,
  };

  try {
    const results = await pool.query('SELECT * FROM GITHUBUSER WHERE username = $1', [userData.username]);

    if (results.rows.length === 0) {
      // Changed to fetch the entire user row
      const insertResult = await pool.query(
        'INSERT INTO GITHUBUSER (githubid, username, avatarurl, accesstoken) VALUES ($1, $2, $3, $4) RETURNING *',
        [userData.githubId, userData.username, userData.avatarUrl, accessToken],
      );
      return callback(null, insertResult.rows[0]); // Return the full user object
    }

    return callback(null, results.rows[0]); // Return the full user object
  } catch (error) {
    return callback(error);
  }
  console.log("User authenticated:", userData);
};

export const GitHub = new GithubStrategy(options, verify);

export default passport;
