import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { validateAuthConfig } from "./auth.js";
import { findOrCreateGitHubUser, getGitHubUser } from "../services/githubUsers.js";

export function configurePassport() {
  validateAuthConfig();
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      done(null, await getGitHubUser(id));
    } catch (error) { done(error); }
  });
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    state: true,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      done(null, await findOrCreateGitHubUser(profile));
    } catch (error) {
      done(error);
    }
  }));
}
export default passport;
