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
