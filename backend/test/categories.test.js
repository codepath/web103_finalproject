import "./setup.js";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import app from "../src/app.js";
import { pool, resetDatabase } from "./helpers/testDatabase.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await resetDatabase();
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

describe("GET /api/categories", () => {
  it("lists all categories sorted by name", async () => {
    const response = await fetch(`${baseUrl}/api/categories`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(
      body.map((category) => category.name),
      ["Career", "Finance", "Health", "Learning", "Personal"],
    );
    for (const category of body) {
      assert.equal(typeof category.id, "number");
      assert.match(category.color, /^#[0-9a-f]{6}$/i);
    }
  });
});
