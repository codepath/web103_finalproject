import './dotenv.js'

import GitHubStrategy from 'passport-github2'
import { pool } from './database.js'
import { GITHUB_CALLBACK_URL } from './urls.js'

const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    // Must be set here rather than on passport.authenticate(): passport-oauth2
    // picks its state store in the constructor, and without this it falls back
    // to a NullStore that verifies nothing — i.e. no CSRF protection at all.
    state: true
}

// GitHub lets users hide their address, so fall back to the noreply alias
// GitHub itself issues for that account — still a real, deliverable address.
const resolveEmail = (profile) => {
    const { id, login, email } = profile._json

    return profile.emails?.[0]?.value
        || email
        || `${id}+${login}@users.noreply.github.com`
}

// matches VARCHAR(50) on users.username in schema.sql
const USERNAME_MAX = 50

// Case-insensitive to match the signup check in usersController.createUser —
// otherwise GitHub "Carla" slips past a local "carla" and we end up with two
// accounts that look identical to a reader.
const isUsernameFree = async (username) => {
    const { rowCount } = await pool.query(
        'SELECT 1 FROM users WHERE LOWER(username) = LOWER($1)',
        [username]
    )
    return rowCount === 0
}

// A GitHub login is unique on GitHub, but username is NOT NULL UNIQUE here and
// a local signup may already have claimed it. Fall back to a github_id-suffixed
// variant, which can't collide with another GitHub account.
const resolveUsername = async (login, githubId) => {
    // Trim separators left dangling by the slice, so a truncated login yields
    // "averylongname-123" rather than "averylongname--123".
    const withSuffix = (suffix) =>
        login.slice(0, USERNAME_MAX - suffix.length).replace(/[-_]+$/, '') + suffix

    const candidates = [login.slice(0, USERNAME_MAX), withSuffix(`-${githubId}`)]

    for (const candidate of candidates) {
        if (await isUsernameFree(candidate)) return candidate
    }

    // Both taken — only possible if a local user picked the suffixed form by
    // hand. Walk a counter rather than letting the insert throw.
    for (let n = 2; n <= 50; n++) {
        const candidate = withSuffix(`-${githubId}-${n}`)
        if (await isUsernameFree(candidate)) return candidate
    }

    throw new Error(`could not derive a free username for GitHub login "${login}"`)
}

const verify = async (accessToken, refreshToken, profile, callback) => {
    const {
        _json: { id, login, avatar_url }
    } = profile

    const userData = {
        githubId: String(id),
        username: login,
        avatarUrl: avatar_url,
        // Lowercased to match how usersController stores addresses. Comparing
        // raw meant a GitHub "Carla@Example.com" never matched the local
        // "carla@example.com", fell through to the INSERT below, and died on
        // the email UNIQUE constraint.
        email: resolveEmail(profile).toLowerCase()
    }

    try {
        // github_id, not username: GitHub logins are renameable, the id is not
        const found = await pool.query(
            'SELECT * FROM users WHERE github_id = $1',
            [userData.githubId]
        )
        const user = found.rows[0]

        if (user) {
            // Track a GitHub rename, but only if that name is still free here —
            // otherwise keep the current one so a collision can't lock them out.
            const username =
                user.username === userData.username || !(await isUsernameFree(userData.username))
                    ? user.username
                    : userData.username

            const existing = await pool.query(
                `UPDATE users
                    SET username = $2, profile_image_url = $3
                    WHERE github_id = $1
                    RETURNING *`,
                [userData.githubId, username, userData.avatarUrl]
            )

            return callback(null, existing.rows[0])
        }

        // No GitHub row yet. Look the address up explicitly instead of relying
        // on a conditional UPDATE to miss: "no such email" and "email exists but
        // is already linked to another GitHub account" both return zero rows,
        // and only one of them should fall through to the INSERT.
        const existingByEmail = await pool.query(
            'SELECT user_id, github_id FROM users WHERE LOWER(email) = $1',
            [userData.email]
        )
        const match = existingByEmail.rows[0]

        if (match) {
            if (match.github_id) {
                // Some other GitHub account already owns this address — the id
                // lookup above would have found it if it were this one.
                return callback(null, false, { code: 'account_conflict' })
            }

            // They already signed up locally with this address, so attach
            // GitHub to that account. Their existing username is left alone —
            // it's already UNIQUE and theirs to change.
            const linked = await pool.query(
                `UPDATE users
                    SET github_id = $2, profile_image_url = $3
                    WHERE user_id = $1
                    RETURNING *`,
                [match.user_id, userData.githubId, userData.avatarUrl]
            )

            return callback(null, linked.rows[0])
        }

        // Brand new user. No password_hash here — github_id satisfies the
        // users_has_credential check on its own.
        const username = await resolveUsername(userData.username, userData.githubId)
        const created = await pool.query(
            `INSERT INTO users (email, username, github_id, profile_image_url)
            VALUES($1, $2, $3, $4)
            RETURNING *`,
            [userData.email, username, userData.githubId, userData.avatarUrl]
        )

        return callback(null, created.rows[0])
    } catch (error) {
        // The lookup above is check-then-insert, so a concurrent sign-in can
        // still beat us to the row. The unique constraint is the real guarantee
        // — surface it as a clean failure rather than a stack.
        if (error.code === '23505') {
            return callback(null, false, { code: 'account_conflict' })
        }
        return callback(error)
    }
}

const GitHub = new GitHubStrategy(options, verify)

export default { GitHub }
