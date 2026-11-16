# Database SQL

`schema.sql` implements the six tables from the project ERD. `seed.sql` adds
three demo users, two trips, five memberships, five activities (including an
unscheduled suggestion), seven votes, and three expenses.

From `server/`, run `npm run reset -- --confirm` against a dedicated development
database. It drops and recreates the six application tables and inserts sample
data in one transaction. Existing application data is replaced. Unrelated
tables are not dropped; external dependencies on application tables cause a
rollback. Reset is disabled when `NODE_ENV=production`.

Seeded trip IDs are 1 and 2. User IDs are 1 (Yingshu), 2 (Yugant), and 3 (Arnold).
The invite codes are `SEATTLE26` and `PORTLAND26`. These users are demo data,
not authenticated accounts. Both trips include their organizer as a member.

Uniqueness, foreign keys, roles, monetary limits, and trip date order are
enforced in SQL. As specified in the ERD, membership authorization, organizer
protection, activity date boundaries, and vote eligibility still need API
validation. Future PATCH handlers must explicitly update `updated_at`.

Run `npm run test:db` to validate the SQL using the configured PostgreSQL
connection. Tests use a unique schema inside a transaction and roll back all
test objects and data; they do not reset the application tables.

## GitHub authentication

Run `npm run migrate` to add `user_github_accounts` (one identity per user),
`user_sessions`, and nullable user emails without resetting existing data.
The current migration does not remove any legacy Google ID columns.

## Starter trips

New GitHub identities receive one starter trip with organizer membership and three
sample activities in the same transaction as user/identity creation. Existing
GitHub users are not backfilled. No schema change or reset is required.

From the repository root, `RUN_DATABASE_TESTS=1 node --test server/tests/starter-trip.test.js`
checks initial/repeated/concurrent signup, separate ownership, deletion, and rollback
using an isolated schema that is cleaned up afterward. Ordinary `npm test` skips
this database-dependent test.
