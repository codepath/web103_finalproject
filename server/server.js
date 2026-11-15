import express from 'express'
import { fileURLToPath } from 'node:url'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import passport from 'passport'
import { pool } from './config/database.js'
import authRouter from './routes/auth.js'
import eventsRouter from './routes/events.js'
import lookupsRouter from './routes/lookups.js'
import profileRouter from './routes/profile.js'
import { requireAuth } from './middleware/auth.js'
import { resetDemoData } from './config/reset.js'

// express-session only warns without a secret, so fail loudly instead
if (!process.env.SESSION_SECRET)
  throw new Error('SESSION_SECRET is missing from .env')

const app = express()
// Render sits behind a proxy; without this, secure cookies are never set
app.set('trust proxy', 1)
app.use(express.json())

// Sessions live in Postgres so logins survive Render restarts
const PgSession = connectPgSimple(session)
app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  }),
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/auth', authRouter)
app.use('/api/events', eventsRouter)
app.use('/api/profile', profileRouter)
app.use('/api', lookupsRouter)

// Custom non-RESTful action: put the demo events/venues/tags back to their seeded state
app.post('/api/reset', requireAuth, async (req, res) => {
  try {
    await resetDemoData(pool)
    res.json({ status: 'reset' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Unknown API paths get a JSON 404 instead of the React page below
app.use(['/api', '/auth'], (req, res) =>
  res.status(404).json({ error: 'Not found' }),
)

// Serve the built React app (npm run build) from the same origin as the API, so
// the login cookie and /api calls need no CORS. In dev, Vite serves the client instead.
const clientDist = fileURLToPath(new URL('../client/dist', import.meta.url))
app.use(express.static(clientDist))
// Any other path is a React Router route: send index.html so refreshing /events/5 works
app.get('*', (req, res) => res.sendFile('index.html', { root: clientDist }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`),
)
