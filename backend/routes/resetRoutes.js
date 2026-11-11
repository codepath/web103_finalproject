
import { Router } from "express";
import pg from "pg";
import resetModule from "../../database/reset.js";

const { resetDatabase } = resetModule;
const router = Router();

router.post("/", async (req, res, next) => {
  // Never allow resets in production
  if (
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_TEST_RESET !== "true"
  ) {
    return res.status(403).json({
      error: "Database reset is disabled."
    });
  }

  // Only accept local requests
  const localAddresses = [
    "127.0.0.1",
    "::1",
    "::ffff:127.0.0.1"
  ];

  if (!localAddresses.includes(req.ip)) {
    return res.status(403).json({
      error: "Local access only."
    });
  }

  // Never use the shared DATABASE_URL
  if (!process.env.TEST_DATABASE_URL) {
    return res.status(503).json({
      error: "Dedicated test database not configured."
    });
  }

  const client = new pg.Client({
    connectionString: process.env.TEST_DATABASE_URL
  });

  try {
    await client.connect();
    await resetDatabase(client);

    res.json({
      message: "Test database reset successfully."
    });
  } catch (error) {
    next(error);
  } finally {
    await client.end().catch(() => {});
  }
});

export default router;
