import express from 'express'
import passport from 'passport'

const router = express.Router()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({ success: true, user: req.user })
        return
    }

    res.status(401).json({ success: false, message: 'Not authenticated' })
})

router.get('/login/failed', (req, res) => {
    res.status(401).json({ success: false, message: "failure" })
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Logout failed' })
            }

            res.clearCookie('connect.sid')
            res.json({ success: true, status: "logout", user: {} })
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
        successRedirect: CLIENT_URL,
        failureRedirect: `${CLIENT_URL}/login?error=oauth`,
    })
)

export default router
