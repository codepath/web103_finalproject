import './dotenv.js'

// Every origin the app needs, in one place. Both default to the dev ports, so a
// fresh clone runs with no .env entries at all — set them for any non-localhost
// deploy.
//
// Trailing slashes are stripped in both directions: a CLIENT_URL ending in '/'
// would otherwise build '.../\/login', and GitHub matches the callback URL
// byte-for-byte, so a stray slash is a redirect_uri_mismatch.
const trim = (url) => url.replace(/\/+$/, '')

export const SERVER_URL = trim(process.env.SERVER_URL || 'http://localhost:3000')
export const CLIENT_URL = trim(process.env.CLIENT_URL || 'http://localhost:5173')

// Must match the callback URL registered on the GitHub OAuth app exactly.
export const GITHUB_CALLBACK_URL = `${SERVER_URL}/auth/github/callback`
