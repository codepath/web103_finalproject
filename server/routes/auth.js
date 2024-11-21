import express from 'express'
import passport from 'passport'

const router = express();

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
            return next(error)
        }

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

router.get(
    '/github/callback',
    passport.authenticate('github', {
        successRedirect: 'http://localhost:3002',
        failureRedirect:'http://localhost:3000/login',
    })
)

export default router;