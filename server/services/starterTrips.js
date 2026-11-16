import { randomBytes } from "node:crypto";

// Use the caller's transaction so a failed sample activity also rolls back signup.
export async function createStarterTrip(client, userId) {
  const { rows } = await client.query(
    `INSERT INTO trips
      (organizer_id, title, destination, start_date, end_date, budget, invite_code)
     VALUES ($1, 'Your first trip', 'Seattle', CURRENT_DATE + 7, CURRENT_DATE + 9, 300, $2)
     RETURNING id, start_date`,
    [userId, randomBytes(8).toString("hex").toUpperCase()],
  );
  const trip = rows[0];
  await client.query(
    "INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1, $2, 'organizer')",
    [trip.id, userId],
  );
  await client.query(
    `INSERT INTO activities
      (trip_id, created_by_id, title, location, scheduled_date, description, estimated_cost)
     VALUES
      ($1, $2, 'Explore the city', 'Seattle', $3::date,
       'Sample activity: edit this idea or add your own places to visit.', 0),
      ($1, $2, 'Meet up for coffee', 'Seattle', $3::date + 1,
       'Sample activity: choose a cafe with your group and try voting on this idea.', 15),
      ($1, $2, 'Plan a group dinner', 'Seattle', $3::date + 2,
       'Sample activity: update the location and cost, then invite friends to help plan.', 35)`,
    [trip.id, userId, trip.start_date],
  );
  return trip.id;
}
