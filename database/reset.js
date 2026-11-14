
const fs = require("node:fs");
const path = require("node:path");

async function resetDatabase(client) {
  // Only permit resets of the dedicated test database
  const result = await client.query(
    "SELECT current_database() AS name"
  );

  if (result.rows[0].name !== "prepwise_test") {
    throw new Error(
      "Reset blocked: only prepwise_test can be reset."
    );
  }

  const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf8"
  );

  const seed = fs.readFileSync(
    path.join(__dirname, "seed.sql"),
    "utf8"
  );

  await client.query("BEGIN");

  try {
    await client.query(schema);

    await client.query(`
      TRUNCATE TABLE users, ingredients, recipes
      RESTART IDENTITY CASCADE
    `);

    await client.query(seed);
    await client.query("COMMIT");

    console.log("Test database reset successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

module.exports = { resetDatabase };

