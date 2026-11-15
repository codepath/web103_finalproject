# Render deployment

TripTogether runs as one Node Web Service: Express serves both the built React
app and `/api`. The database is the existing Render Postgres instance. There is
no separate frontend service or production Vite proxy.

## Current service

- Live URL: https://triptogether-web103-yingshu.onrender.com
- Dashboard: https://dashboard.render.com/web/srv-dbt3l7mk1f9s73aoljeg
- Initial deployed branch: `yingshu/render-deploy`; move to `main` after review and merge.
- Uses the existing `triptogether-db` in Oregon.
- The initial service reuses the development OAuth App with a separate production
  session secret. Add the live callback as an additional redirect URI in that
  GitHub OAuth App; preserve the localhost callback for teammates. A dedicated
  production OAuth App can be used later by updating only Render credentials.

## Web Service settings

Connect the `codepath-12/web103_finalproject` GitHub repository and use:

| Setting | Value |
| --- | --- |
| Branch | `main` after the deployment changes are merged |
| Runtime | Node |
| Root directory | Leave empty (repository root) |
| Region | Oregon, matching the existing database |
| Compute plan | Free |
| Build command | `npm run setup && npm test` |
| Start command | `npm start` |
| Health check path | `/api/health` |

The `.node-version` file selects Node 22. The build installs Vite's development
dependencies explicitly, even when `NODE_ENV=production`. `npm test` builds the
client first through its `pretest` script. The start command runs
the repeatable, data-preserving GitHub/session migration before starting Express.
It never runs the destructive database reset.

## Production environment variables

Configure these in the new Web Service's Environment page. Do not change the
local `server/.env` to production values.

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Existing database's Internal Database URL from Render's Connect menu |
| `CLIENT_URL` | Exact HTTPS URL of the new web service, without a path |
| `GITHUB_CALLBACK_URL` | That same HTTPS URL followed by `/api/auth/github/callback` |
| `GITHUB_CLIENT_ID` | Production GitHub OAuth App's client ID |
| `GITHUB_CLIENT_SECRET` | Production OAuth App's client secret |
| `SESSION_SECRET` | A separate production secret generated with `openssl rand -hex 32` |

Leave `PORT` unset; Render supplies it. Services and database must be in the same
workspace and region for the internal database URL. The database's external IP
rules are for local computers, not same-region private connections.

You can register a separate GitHub OAuth App for the live site, or add the live
callback as an additional redirect URI to the existing App. Preserve the
`http://localhost:5173` callback for local development. Set its Homepage URL to `CLIENT_URL`
and its redirect URI to `GITHUB_CALLBACK_URL`. Fill credentials into Render
directly; they do not belong in the repository or an issue.

Express trusts one reverse proxy in production. Session cookies use `HttpOnly`,
`Secure`, and `SameSite=Lax`; frontend and API share an origin. Do not use a
separate Static Site URL with these settings.

## Verification after a live deploy

1. Confirm `/api/health` returns HTTP 200 and `database: connected`.
2. Open `/login`, sign in with GitHub, and verify the avatar/name in the sidebar.
3. Directly open and refresh `/trips` and a trip's itinerary, expenses, and settings.
4. Use a second GitHub account to join the same trip and test votes and access
   restrictions. Each person signs into their own GitHub account; visitors do
   not need client secrets or database credentials.
5. Test trip/activity/expense create, edit, and delete, including a validation
   failure. Sign out and verify protected routes require login again.
6. Add the verified live URL to README and record feature/demo GIFs.

The existing free database expires on November 29, 2026. Keep it accessible for
grading and export needed data before expiration. A free web service can sleep
when idle, so allow time for it to start on the first visit.
