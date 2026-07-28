import express from 'express'
import passport from 'passport'

import { CLIENT_URL } from '../config/urls.js'
import { establishSession } from '../config/session.js'

const router = express.Router()

router.get('/login/success', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'not authenticated' })
    }
    res.status(200).json({ success: true, user: req.user })
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                return next(destroyErr)
            }
            res.clearCookie('connect.sid')
            res.json({ status: "logout", user: {} })
        })
    })
})

router.get(
    '/github',
    passport.authenticate('github', {
        // user:email also returns addresses the user keeps private
        scope: [ 'read:user', 'user:email' ]
    })
)

// A custom callback rather than successRedirect/failureRedirect: failureRedirect
// does NOT fire when the verify callback errors — passport hands those to
// next(err) — so the declarative form can't get the user back to the client at
// all. This shape covers error, refusal and consent-denied the same way.
router.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', async (err, user, info) => {
        // Failures go back to /login, which is the only page that reads
        // ?error= and turns the code into a message.
        if (err) {
            console.error('github oauth failed:', err)
            return res.redirect(`${CLIENT_URL}/login?error=oauth_failed`)
        }

        // Also covers the user cancelling at GitHub and a bad state parameter:
        // passport-oauth2 turns both into a fail().
        if (!user) {
            return res.redirect(`${CLIENT_URL}/login?error=${info?.code ?? 'oauth_denied'}`)
        }

        try {
            await establishSession(req, user)
            // '/' is the dashboard; the client's route guard revalidates the
            // session it was just handed.
            res.redirect(`${CLIENT_URL}/`)
        } catch (loginError) {
            next(loginError)
        }
    })(req, res, next)
})

export default router
