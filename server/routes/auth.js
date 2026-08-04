import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({ success: true, user: req.user })
    }
})

router.get('/login/failed', (req, res) => {
    res.status(401).json({ success: true, message: "failure" })
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        console.log('logout failed')
        return next(err)
      }
      console.log('logout successful')
      req.session.destroy((err) => {
        res.clearCookie('connect.sid')
        res.json({ status: "logout", user: {} })
      })
    })
})

router.get(
  '/github',
  passport.authenticate('github', {
    scope: [ 'read:user' ]
  })
)

// router.get(
//   '/github/callback',
//   passport.authenticate('github', {
//     successRedirect: '/',
//     failureRedirect:'/destinations',
//   })
// )

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: 'http://localhost:5173/',
  }),
  (req, res) => {
    res.redirect('http://localhost:5173/home')
  }
)

export default router
