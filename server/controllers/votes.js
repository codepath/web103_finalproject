import pool from "../config/database.js";

async function voteCount(activityId) {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM activity_votes WHERE activity_id = $1",
    [activityId],
  );
  return rows[0].count;
}

// One vote per participant per activity: the primary key makes repeats a no-op.
export async function addVote(req, res, next) {
  try {
    await pool.query(
      `INSERT INTO activity_votes (activity_id, user_id) VALUES ($1, $2)
       ON CONFLICT (activity_id, user_id) DO NOTHING`,
      [req.activity.id, req.userId],
    );
    res.json({ vote_count: await voteCount(req.activity.id), user_voted: true });
  } catch (error) {
    next(error);
  }
}

export async function removeVote(req, res, next) {
  try {
    await pool.query("DELETE FROM activity_votes WHERE activity_id = $1 AND user_id = $2", [
      req.activity.id,
      req.userId,
    ]);
    res.json({ vote_count: await voteCount(req.activity.id), user_voted: false });
  } catch (error) {
    next(error);
  }
}
