import express from 'express';
import passport from 'passport';

const router = express.Router();

const FRONTEND_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL_PROD || 'https://your-deployed-frontend.com'
    : process.env.FRONTEND_URL_DEV || 'http://localhost:5173';

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/journals`);
  }
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(FRONTEND_URL);
  });
});

router.get('/current-user', (req, res) => {
  res.json(req.user || null);
});


export default router;
