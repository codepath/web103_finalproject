import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { serveClient } from "../config/client.js";

test("production serves page refreshes and assets without hiding missing APIs or assets", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "triptogether-client-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, "assets"));
  await writeFile(join(directory, "index.html"), "<!doctype html><title>TripTogether test</title>");
  await writeFile(join(directory, "assets/app-123.js"), "console.log('test')");
  const app = express();
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  serveClient(app, directory);
  app.use((_req, res) => res.status(404).json({ error: "Not found" }));
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of ["/", "/login", "/trips", "/trips/1/expenses", "/trips/1/settings"]) {
    const response = await fetch(base + path, { headers: { Accept: "text/html" } });
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /TripTogether test/);
    assert.equal(response.headers.get("cache-control"), "no-cache");
  }
  const asset = await fetch(base + "/assets/app-123.js");
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get("cache-control"), /immutable/);
  const health = await fetch(base + "/api/health");
  assert.deepEqual(await health.json(), { status: "ok" });
  for (const path of ["/api", "/api/unknown", "/assets/missing.js", "/assets/missing", "/missing.css"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404, path);
    assert.match(response.headers.get("content-type"), /application\/json/);
  }
});

test("production startup gives an actionable error if the client has not been built", () => {
  assert.throws(() => serveClient(express(), "/missing/triptogether-dist"), /npm run build/);
});

test("the complete production app serves HTML outside the API session cookie path", async (t) => {
  // No real credentials or database connection are needed for public pages or a 401.
  Object.assign(process.env, {
    NODE_ENV: "production",
    CLIENT_URL: "https://triptogether.example",
    GITHUB_CALLBACK_URL: "https://triptogether.example/api/auth/github/callback",
    GITHUB_CLIENT_ID: "test-client",
    GITHUB_CLIENT_SECRET: "test-secret",
    SESSION_SECRET: "test-only-secret-with-at-least-32-characters",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  });
  const { default: app } = await import("../app.js");
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of ["/", "/login", "/trips/1/expenses"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type"), /text\/html/);
  }
  const me = await fetch(base + "/api/auth/me");
  assert.equal(me.status, 401);
  assert.match(me.headers.get("content-type"), /application\/json/);
  const logout = await fetch(base + "/api/auth/logout", {
    method: "POST", headers: { Origin: "https://untrusted.example" },
  });
  assert.equal(logout.status, 403);
  assert.equal(app.get("trust proxy"), 1);
});
