import './dotenv.js'

// No dev fallback on purpose. The old `|| "codepath"` default was committed to
// git, so any deploy missing this var silently accepted forged session cookies.
const secret = process.env.SESSION_SECRET
if (!secret) {
    throw new Error(
        'SESSION_SECRET is not set. Add a long random string to Code/server/.env — see .env.example.\n' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    )
}

export const sessionOptions = {
    secret,
    resave: false,
    // Don't mint a session for every anonymous visitor; only persist once
    // something is actually stored (a login, or the OAuth state parameter).
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // 'lax' still allows the top-level GET redirect back from GitHub, and
        // :5173 -> :3000 is same-site (ports aren't part of same-site), so the
        // credentialed getSession fetch keeps working too.
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// Passport's req.logIn does NOT rotate the session id, so without regenerating
// first, an attacker who fixed a victim's pre-login session id still holds a
// valid one after they authenticate.
export const establishSession = (req, user) =>
    new Promise((resolve, reject) => {
        req.session.regenerate((regenError) => {
            if (regenError) return reject(regenError)
            req.logIn(user, (loginError) => (loginError ? reject(loginError) : resolve()))
        })
    })
