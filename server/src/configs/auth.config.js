import GitHubStrategy from "passport-github2";
import User from "../models/user.js";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // callbackURL: 'http://localhost:3001/auth/github/callback'
};

const verify = async (accessToken, refreshToken, profile, done) => {
  const {
    _json: { id, avatar_url, email, name },
  } = profile;

  const userData = {
    email,
    githubId: id,
    username: name,
    profilePicture: avatar_url,
  };

  try {
    const { rows } = await User.findOneByGithubId(userData.githubId);
    const user = rows[0];

    if (!user) {
      const { rows } = await User.create(userData);
      const newUser = rows[0];
      return done(null, newUser);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);
