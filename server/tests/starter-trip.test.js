import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import pool from "../config/database.js";
import { findOrCreateGitHubUser } from "../services/githubUsers.js";

// Opt in explicitly: ordinary builds must not require access to a live database.
test("first-login starter trips (isolated PostgreSQL schema)", {
  skip: process.env.RUN_DATABASE_TESTS !== "1",
}, async (t) => {
  const schema = `starter_test_${randomUUID().replaceAll("-", "")}`;
  await pool.query(`CREATE SCHEMA "${schema}"`);
  t.after(async () => {
    try { await pool.query(`DROP SCHEMA "${schema}" CASCADE`); }
    finally { await pool.end(); }
  });
  const setup = await pool.connect();
  try {
    await setup.query("BEGIN");
    await setup.query(`SET LOCAL search_path TO "${schema}"`);
    await setup.query(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));
    await setup.query("COMMIT");
  } catch (error) {
    await setup.query("ROLLBACK");
    throw error;
  } finally { setup.release(); }

  // Every service transaction is confined to the disposable schema. SET LOCAL
  // automatically resets on COMMIT/ROLLBACK before the connection is released.
  const database = {
    async connect() {
      const client = await pool.connect();
      return {
        async query(sql, values) {
          const result = await client.query(sql, values);
          if (sql === "BEGIN") await client.query(`SET LOCAL search_path TO "${schema}"`);
          return result;
        },
        release: () => client.release(),
      };
    },
  };
  const profile = (id) => ({ id: `test-${id}`, displayName: `Test ${id}`, username: `test-${id}` });
  async function tripsFor(userId) {
    return (await pool.query(`SELECT * FROM "${schema}".trips WHERE organizer_id = $1`, [userId])).rows;
  }

  await t.test("a new identity gets one owned trip and three editable activities within future trip dates", async () => {
    const user = await findOrCreateGitHubUser(profile("first"), database);
    const trips = await tripsFor(user.id);
    assert.equal(trips.length, 1);
    const trip = trips[0];
    assert.equal(trip.title, "Your first trip");
    assert.equal(trip.budget, 300);
    assert.match(trip.invite_code, /^[0-9A-F]{16}$/);
    const member = await pool.query(`SELECT role FROM "${schema}".trip_members WHERE trip_id = $1 AND user_id = $2`, [trip.id, user.id]);
    assert.equal(member.rows[0].role, "organizer");
    const activities = await pool.query(`SELECT * FROM "${schema}".activities WHERE trip_id = $1`, [trip.id]);
    assert.equal(activities.rows.length, 3);
    for (const activity of activities.rows) {
      assert.equal(activity.created_by_id, user.id);
      assert.ok(activity.scheduled_date >= trip.start_date && activity.scheduled_date <= trip.end_date);
      assert.ok(activity.estimated_cost >= 0);
    }
    const dates = await pool.query(`SELECT start_date = CURRENT_DATE + 7 AS upcoming, end_date - start_date AS days FROM "${schema}".trips WHERE id = $1`, [trip.id]);
    assert.deepEqual(dates.rows[0], { upcoming: true, days: 2 });
    const again = await findOrCreateGitHubUser(profile("first"), database);
    assert.equal(again.id, user.id);
    assert.equal((await tripsFor(user.id)).length, 1);
  });

  await t.test("an existing GitHub user without trips is left unchanged", async () => {
    const existing = await pool.query(`INSERT INTO "${schema}".users (name) VALUES ('Existing user') RETURNING id`);
    const id = existing.rows[0].id;
    await pool.query(`INSERT INTO "${schema}".user_github_accounts (user_id, github_id) VALUES ($1, $2)`, [id, "test-existing"]);
    assert.equal((await findOrCreateGitHubUser(profile("existing"), database)).id, id);
    assert.equal((await tripsFor(id)).length, 0);
  });

  await t.test("simultaneous first logins create only one user, membership and starter trip", async () => {
    const [first, second] = await Promise.all([
      findOrCreateGitHubUser(profile("concurrent"), database),
      findOrCreateGitHubUser(profile("concurrent"), database),
    ]);
    assert.equal(first.id, second.id);
    const trips = await tripsFor(first.id);
    assert.equal(trips.length, 1);
    const members = await pool.query(`SELECT count(*)::int AS count FROM "${schema}".trip_members WHERE trip_id = $1`, [trips[0].id]);
    assert.equal(members.rows[0].count, 1);
    const activities = await pool.query(`SELECT count(*)::int AS count FROM "${schema}".activities WHERE trip_id = $1`, [trips[0].id]);
    assert.equal(activities.rows[0].count, 3);
  });

  await t.test("deleting a starter trip does not recreate it on the next login", async () => {
    const user = await findOrCreateGitHubUser(profile("delete"), database);
    await pool.query(`DELETE FROM "${schema}".trips WHERE organizer_id = $1`, [user.id]);
    await findOrCreateGitHubUser(profile("delete"), database);
    assert.equal((await tripsFor(user.id)).length, 0);
  });

  await t.test("different users receive separate trips and invitation codes", async () => {
    const a = await findOrCreateGitHubUser(profile("person-a"), database);
    const b = await findOrCreateGitHubUser(profile("person-b"), database);
    const [aTrip] = await tripsFor(a.id);
    const [bTrip] = await tripsFor(b.id);
    assert.notEqual(aTrip.id, bTrip.id);
    assert.notEqual(aTrip.invite_code, bTrip.invite_code);
  });

  await t.test("an activity failure rolls back the user, identity, trip and membership; retry succeeds", async () => {
    await pool.query(`CREATE FUNCTION "${schema}".reject_activity() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Injected activity failure'; END $$`);
    await pool.query(`CREATE TRIGGER reject_activity BEFORE INSERT ON "${schema}".activities FOR EACH ROW EXECUTE FUNCTION "${schema}".reject_activity()`);
    try {
      await assert.rejects(findOrCreateGitHubUser(profile("rollback"), database), /Injected activity failure/);
      const users = await pool.query(`SELECT count(*)::int AS count FROM "${schema}".users WHERE name = 'Test rollback'`);
      assert.equal(users.rows[0].count, 0);
      const accounts = await pool.query(`SELECT count(*)::int AS count FROM "${schema}".user_github_accounts WHERE github_id = 'test-rollback'`);
      assert.equal(accounts.rows[0].count, 0);
      const orphans = await pool.query(`SELECT count(*)::int AS count FROM "${schema}".trips t LEFT JOIN "${schema}".users u ON u.id = t.organizer_id WHERE u.id IS NULL`);
      assert.equal(orphans.rows[0].count, 0);
    } finally {
      await pool.query(`DROP TRIGGER reject_activity ON "${schema}".activities`);
    }
    const user = await findOrCreateGitHubUser(profile("rollback"), database);
    assert.equal((await tripsFor(user.id)).length, 1);
  });
});
