// Import this module before anything that touches the database.
//
// Tests drop and recreate every table, so they must never run against the
// development or Render database. Connection settings come from the ignored
// `backend/.env.test` file (see `.env.test.example`), which overrides any
// values from `.env` or the shell, and the database name must end in "_test".
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const backendDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const testEnvironmentPath = path.join(backendDirectory, ".env.test");

if (fs.existsSync(testEnvironmentPath)) {
  dotenv.config({ path: testEnvironmentPath, override: true });
}

process.env.NODE_ENV = "test";

const databaseName = process.env.PGDATABASE ?? "";
const databaseHost = process.env.PGHOST ?? "";

if (!databaseName.endsWith("_test")) {
  throw new Error(
    "Refusing to run tests: PGDATABASE must name a dedicated test database " +
      'ending in "_test". Create backend/.env.test from .env.test.example.',
  );
}

if (databaseHost.endsWith(".render.com")) {
  throw new Error("Refusing to run tests against a Render-hosted database.");
}
