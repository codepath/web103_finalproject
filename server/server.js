import cors from 'cors';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { GitHub } from './config/auth.js';

import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import entryRoutes from './routes/entries.js';
import resetRoutes from './routes/reset.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  })
);

app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  res.send('LayoffLens API is running.');
});

app.use('/api/companies', companyRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/reset', resetRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
