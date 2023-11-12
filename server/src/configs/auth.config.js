import GitHubStrategy from "passport-github2";
import User from "../models/user.js";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // callbackURL: 'http://localhost:3001/auth/github/callback'
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, avatar_url, email },
    displayName,
  } = profile;

  const userData = {
    email,
    githubId: id,
    username: displayName,
    profilePicture: avatar_url,
    accessToken,
  };

  try {
    const results = await User.findOneByGithubId(userData.githubId);
    const user = results.rows[0];

    if (!user) {
      const results = await User.create(userData);
      const newUser = results.rows[0];
      return callback(null, newUser);
    }

    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);
