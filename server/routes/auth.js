import express from 'express'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { pool } from '../config/database.js'

const userColumns = 'id, username, name, avatar_url'

// Upserts the user and, on first login only, generates their profile from GitHub data.
// One statement, so the user and profile are created together or not at all.
// ON CONFLICT DO NOTHING keeps any edits the user later makes to their profile.
const loginQuery = `
  WITH u AS (
    INSERT INTO users (github_id, username, name, avatar_url) VALUES ($1, $2, $3, $4)
    ON CONFLICT (github_id) DO UPDATE SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url
    RETURNING ${userColumns}
  ), p AS (
    INSERT INTO profiles (user_id, bio, city, website_url)
    SELECT id, $5, $6, $7 FROM u
    ON CONFLICT (user_id) DO NOTHING
  )
  SELECT * FROM u`

// GitHub returns '' for blank fields; store those as NULL
const orNull = (value) => value || null

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const {
          rows: [user],
        } = await pool.query(loginQuery, [
          profile.id,
          profile.username,
          profile.displayName || profile.username,
          profile.photos?.[0]?.value ?? null,
          orNull(profile._json?.bio),
          orNull(profile._json?.location),
          orNull(profile._json?.blog),
        ])
        done(null, user)
      } catch (err) {
        done(err)
      }
    },
  ),
)

// Session cookie stores only the user id; req.user is reloaded on each request
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${userColumns} FROM users WHERE id = $1`,
      [id],
    )
    done(null, rows[0] ?? false)
  } catch (err) {
    done(err)
  }
})

const router = express.Router()

router.get('/github', passport.authenticate('github'))

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/?login=failed' }),
  (req, res) => res.redirect('/'),
)

// null when logged out, so the client can always call this on load
router.get('/me', (req, res) => res.json(req.user ?? null))

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.status(204).end()
    })
  })
})

export default router
