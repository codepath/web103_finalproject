import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/login/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, message: 'Login successful', user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({ success: true, message: 'failure' })
})

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }

    req.session.destroy((err) => {
      res.clearCookie('connect.sid')
      res.json({ status: 'logout', user: {} })
    })
  })
})

router.get('/github', passport.authenticate('github', {
  scope: ['read:user']
}))

// router.get('/auth/github/callback', passport.authenticate('github', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// }));

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', (err, user, info) => {
    console.log('GitHub Callback Hit');
    if (err) {
      console.error('Authentication Error:', err);
      return next(err);
    }
    if (!user) {
      console.error('No User Returned:', info);
      return res.redirect('/login/failed');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login Error:', err);
        return next(err);
      }
      // Redirect to the frontend URL after successful login
      return res.redirect('http://localhost:5173/');
    });
  })(req, res, next);
});




// router.get('/auth/github/callback', (req, res) => {
//   console.log('Callback route reached');
//   res.send('Callback route hit');
// });


export default router