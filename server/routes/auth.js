import express from 'express';
import passport from 'passport';

const router = express.Router();

// Login success
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// Login failed
router.get('/login/failed', (req, res) => {
  res.status(401).json({ success: false, message: 'Login failed' });
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      res.clearCookie('connect.sid');
      res.json({ status: 'logout', user: {} });
    });
  });
});

// Redirect to GitHub
router.get(
  '/github',
  passport.authenticate('github', { scope: ['read:user'] })
);

// GitHub callback
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5175';
router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: `${CLIENT_URL}/`,
    failureRedirect: `${CLIENT_URL}/login?error=github_auth_failed`,
  })
);

export default router;
