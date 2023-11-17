// import express from 'express';
// import cors from 'cors';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import UserRoutes from './routes/UserRoutes.js';
// import PostRoutes from './routes/PostRoutes.js';
// import CommentRoutes from './routes/CommentRoutes.js';
// import ResourceRoutes from './routes/ResourceRoutes.js';
// import TypeRoutes from './routes/TypeRoutes.js';
// import authRoutes from './routes/auth.js';
// import { pool } from './config/database.js';
// import passport, { GitHub } from './config/auth.js';
// import session from 'express-session';
// import connectPgSimple from 'connect-pg-simple';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PgSession = connectPgSimple(session);

// app.use(session({
//   secret: 'myeshafarnaz',
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(express.json());

// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://codefm-production.up.railway.app' : 'http://localhost:5173',
//   methods: 'GET,POST,PUT,DELETE,PATCH',
//   credentials: true,
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(GitHub);

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const result = await pool.query('SELECT * FROM GITHUBUSER WHERE id = $1', [id]);
//   if (result.rows.length > 0) {
//     done(null, result.rows[0]);
//   } else {
//     done(new Error('User not found'), null);
//   }
// });

// // Place your API and Auth routes before the static files middleware
// app.use('/auth', authRoutes);
// app.use('/api/users', UserRoutes);
// app.use('/api/posts', PostRoutes);
// app.use('/api/comments', CommentRoutes);
// app.use('/api/resources', ResourceRoutes);
// app.use('/api/types', TypeRoutes);

// // Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'public')));

//   // React routing, return all requests to React app
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
//   });
// } else {
//   // If not in production, serve your 'CodeFM Backend' message
//   app.get('/', (req, res) => {
//     res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ CodeFM Backend</h1>');
//   });
// }

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import UserRoutes from './routes/UserRoutes.js';
import PostRoutes from './routes/PostRoutes.js';
import CommentRoutes from './routes/CommentRoutes.js';
import ResourceRoutes from './routes/ResourceRoutes.js';
import TypeRoutes from './routes/TypeRoutes.js';
import authRoutes from './routes/auth.js';
import { pool } from './config/database.js';
import passport, { GitHub } from './config/auth.js'; // import modified passport with GitHub strategy
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'; // Import the module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Environment Variables:');
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET);
console.log('GITHUB_CALLBACK_URL:', process.env.GITHUB_CALLBACK_URL);
console.log('API_URL:', process.env.API_URL);

const app = express();

const PgSession = connectPgSimple(session);

app.use(session({
  secret: 'myeshafarnaz',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: 'GET,POST,PUT,DELETE,PATCH',
//   credentials: true,
// }));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://codefm-client-production.up.railway.app' : 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true,
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(GitHub);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM GITHUBUSER WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null);
  }
});

// app.get('/', (req, res) => {
//   res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ CodeFM Backend</h1>');
// });

app.get('/login/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});


app.use('/auth', authRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/posts', PostRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/resources', ResourceRoutes);
app.use('/api/types', TypeRoutes);

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
