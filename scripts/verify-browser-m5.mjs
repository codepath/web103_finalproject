import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { createServer } from "vite";
import { createApp } from "../server/app.js";
import { createPool } from "../server/db/pool.js";
import { initializeDatabase } from "../server/db/seed.js";
import { fixtureStrategy } from "../server/testing/auth-fixture.js";

// All mutable browser checks use an isolated schema and a simulated external provider.
// The app, Passport, session store, API, and PostgreSQL queries are the real implementation.
const schema = `skillforge_browser_${randomUUID().replaceAll("-", "")}`;
const adminPool = createPool({ max: 1 });
const output = resolve(".artifacts/m5/browser");
const checks = [],
  errors = [];
let pool, app, apiServer, vite, browser, page;
const origin = "http://127.0.0.1:5174";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const pass = (name) => {
  checks.push(name);
  console.log(`PASS ${name}`);
};
try {
  await mkdir(output, { recursive: true });
  await adminPool.query(`CREATE SCHEMA "${schema}"`);
  pool = createPool({ max: 4, options: `-c search_path=${schema}` });
  assert.equal(
    (await pool.query("SELECT current_schema() AS name")).rows[0].name,
    schema,
  );
  await initializeDatabase(pool);
  app = createApp({
    pool,
    auth: {
      schemaName: schema,
      sessionSecret: "isolated-browser-test-secret",
      clientID: "fixture",
      clientSecret: "fixture",
      clientOrigin: origin,
      callbackURL: `${origin}/auth/callback`,
      strategyFactory: fixtureStrategy,
    },
  });
  apiServer = await new Promise((resolveServer) => {
    const server = app.listen(0, "127.0.0.1", () => resolveServer(server));
  });
  const apiTarget = `http://127.0.0.1:${apiServer.address().port}`;
  vite = await createServer({
    configFile: resolve("client/vite.config.js"),
    root: resolve("client"),
    server: {
      host: "127.0.0.1",
      port: 5174,
      strictPort: true,
      proxy: { "/api": apiTarget, "/auth": apiTarget },
    },
  });
  await vite.listen();
  browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ?? (existsSync(chrome) ? chrome : undefined),
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  page = await context.newPage();
  let provider = "alex",
    cancelSignIn = false,
    authorizationCount = 0;
  page.on("pageerror", (error) => errors.push(error.message));
  // Intercept the initial request: Playwright does not route later URLs in a redirect chain.
  // Preserve the server's session cookie and state, replacing only the external provider hop.
  await context.route(/\/auth\/github(?:\?|$)/, async (route) => {
    authorizationCount++;
    const response = await route.fetch({ maxRedirects: 0 });
    const url = new URL(response.headers().location);
    assert.equal(url.origin, "https://github.com");
    await route.fulfill({
      response,
      status: 302,
      headers: {
        ...response.headers(),
        location: `${origin}/auth/callback?${cancelSignIn ? "error=access_denied" : `code=${provider}`}&state=${url.searchParams.get("state")}`,
      },
    });
  });
  const heading = (name) => page.getByRole("heading", { name, exact: true });
  const row = (title) =>
    page
      .locator(".quest-row")
      .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  async function expectText(locator, expected) {
    await locator.filter({ hasText: expected }).waitFor();
  }
  await page.goto(origin);
  await page
    .getByRole("button", { name: "Sign in with GitHub", exact: true })
    .waitFor();
  await page.locator(".tree-card").first().waitFor();
  assert.equal(await page.locator(".tree-card").count(), 4);
  await expectText(page.locator(".stat-value").first(), /0\s*XP/);
  await page.getByRole("link", { name: /Frontend Mastery with React/ }).click();
  await heading("Frontend Mastery with React").waitFor();
  assert.equal(
    await page.getByLabel("My status", { exact: true }).isDisabled(),
    true,
  );
  await row("Manage React state")
    .getByRole("button", { name: "View quest" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("heading", { name: "Requirements", exact: true })
    .waitFor();
  assert.equal(
    await page.getByRole("button", { name: "Edit quest", exact: true }).count(),
    0,
  );
  await page.getByRole("button", { name: "Close pane" }).click();
  pass(
    "guests browse trees and full quest content without personal data or owner actions",
  );

  await page.getByRole("button", { name: "Forge Quest", exact: true }).click();
  await page.getByRole("button", { name: "Sign out", exact: true }).waitFor();
  assert.equal(new URL(page.url()).pathname, "/trees/1");
  await expectText(page.getByLabel("Total earned XP"), "100 XP earned");
  await page.reload();
  await page.getByRole("button", { name: "Sign out", exact: true }).waitFor();
  pass(
    "GitHub provider fixture returns to the original tree and PostgreSQL session survives refresh",
  );

  await page.getByLabel("Difficulty", { exact: true }).selectOption("beginner");
  await expectText(page.locator(".filter-summary"), "Showing 1 of 3 quests");
  assert.equal(await page.locator(".quest-row").count(), 1);
  await expectText(page.locator(".detail-progress strong"), /1\s*\/\s*3/);
  await page
    .getByLabel("My status", { exact: true })
    .selectOption("in_progress");
  await heading("No quests match these filters.").waitFor();
  await page
    .getByRole("button", { name: "Show all quests", exact: true })
    .click();
  await expectText(page.locator(".filter-summary"), "Showing 3 of 3 quests");
  assert.equal(await page.locator(".quest-row").count(), 3);
  await page.getByLabel("Sort quests", { exact: true }).selectOption("xp");
  await page
    .locator(".quest-content h3")
    .first()
    .filter({ hasText: "Build React routing" })
    .waitFor();
  assert.equal(
    await page.locator(".quest-content h3").first().innerText(),
    "Build React routing",
  );
  await page.getByLabel("Sort quests", { exact: true }).selectOption("title");
  assert.deepEqual(await page.locator(".quest-content h3").allTextContents(), [
    "Build React routing",
    "HTML & CSS foundations",
    "Manage React state",
  ]);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  pass(
    "combined filters, clear results, and deterministic sorting preserve full-tree totals",
  );

  const forge = page.getByRole("button", { name: "Forge Quest", exact: true });
  await forge.click();
  const dialog = page.getByRole("dialog");
  await page.getByLabel("Title *", { exact: true }).waitFor();
  assert.equal(await page.getByLabel("Skill tree *").inputValue(), "1");
  assert.ok(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  );
  await page.keyboard.press("Shift+Tab");
  assert.ok(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  );
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(
    await forge.evaluate((element) => element === document.activeElement),
    true,
  );
  pass(
    "dialog contains keyboard focus, closes on Escape, and restores its trigger",
  );

  await forge.click();
  await page.getByRole("button", { name: "Create quest", exact: true }).click();
  await page.locator(".field-error").first().waitFor();
  await page
    .getByLabel("Title *", { exact: true })
    .fill("Browser portfolio quest");
  page.once("dialog", (prompt) => prompt.dismiss());
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  assert.equal(
    await page.getByLabel("Title *", { exact: true }).inputValue(),
    "Browser portfolio quest",
  );
  await page
    .getByLabel("Description *", { exact: true })
    .fill("Build and ship a useful project.");
  await page
    .getByLabel("Requirements *", { exact: true })
    .fill("Add routes, save data, and document the project.");
  await page.getByLabel("XP reward *").fill("275");
  await page.getByLabel("Roadmap position *").fill("4");
  await page
    .getByLabel("Documentation URLs (one per line)")
    .fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Create quest", exact: true }).click();
  await expectText(page.locator(".field-error"), "HTTP or HTTPS");
  assert.equal(
    await page.getByLabel("Title *", { exact: true }).inputValue(),
    "Browser portfolio quest",
  );
  await page
    .getByLabel("Documentation URLs (one per line)")
    .fill("https://react.dev");
  await page.route("**/api/quests", (route) =>
    route.fulfill({
      status: 503,
      json: { error: "Temporary creation failure" },
    }),
  );
  await page.getByRole("button", { name: "Create quest", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Temporary creation failure" })
    .waitFor();
  assert.equal(
    await page.getByLabel("Title *", { exact: true }).inputValue(),
    "Browser portfolio quest",
  );
  await page.unroute("**/api/quests");
  await page.getByRole("button", { name: "Create quest", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  await row("Browser portfolio quest").waitFor();
  pass(
    "forge validates locally and on the server, confirms dirty dismissal, and creates a persisted quest",
  );

  await row("Browser portfolio quest")
    .getByRole("button", { name: "View quest" })
    .click();
  await page.getByRole("button", { name: "Edit quest", exact: true }).click();
  await page
    .getByLabel("Title *", { exact: true })
    .fill("Edited browser quest");
  await page.getByLabel("Skill tree *").selectOption("2");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  await row("Browser portfolio quest").waitFor({ state: "hidden" });
  await page.goto(`${origin}/trees/2`);
  await row("Edited browser quest").waitFor();
  await page.reload();
  await row("Edited browser quest").waitFor();
  pass("editing moves a quest between trees and persists after refresh");

  await row("Edited browser quest")
    .getByRole("button", { name: "View quest" })
    .click();
  await page
    .getByLabel("Notes", { exact: true })
    .fill("Completed with integration checks.");
  await page
    .getByLabel("Repository URL", { exact: true })
    .fill("https://github.com/example/portfolio");
  await page
    .getByRole("button", { name: "Save my progress", exact: true })
    .click();
  await page.locator(".toast-title", { hasText: "Progress saved" }).waitFor();
  await page.getByRole("button", { name: "Close pane" }).click();
  await row("Edited browser quest")
    .getByRole("button", { name: "View quest" })
    .click();
  await page.getByLabel("Notes", { exact: true }).waitFor();
  assert.equal(
    await page.getByLabel("Notes", { exact: true }).inputValue(),
    "Completed with integration checks.",
  );
  await page.getByRole("button", { name: "Close pane" }).click();
  pass(
    "personal notes and repository URL save independently of shared content",
  );

  const status = row("Edited browser quest").getByRole("combobox");
  let release;
  const gate = new Promise((resolveGate) => {
    release = resolveGate;
  });
  await page.route("**/api/quests/*/progress", async (route) => {
    await gate;
    await route.continue();
  });
  const urlBefore = page.url();
  const token = await page.evaluate(() => {
    window.browserIdentity = "same-document";
    return window.browserIdentity;
  });
  await status.selectOption("completed");
  assert.equal(await status.isDisabled(), true);
  release();
  await expectText(page.getByLabel("Total earned XP"), "375 XP earned");
  assert.equal(page.url(), urlBefore);
  assert.equal(await page.evaluate(() => window.browserIdentity), token);
  await page.unroute("**/api/quests/*/progress");
  await page.route("**/api/quests/*/progress", (route) =>
    route.fulfill({ status: 503, json: { error: "Temporary save failure" } }),
  );
  await status.selectOption("backlog");
  await page.getByRole("button", { name: "Retry status save" }).waitFor();
  assert.equal(await status.inputValue(), "completed");
  await expectText(page.getByLabel("Total earned XP"), "375 XP earned");
  await page.unroute("**/api/quests/*/progress");
  await page.getByRole("button", { name: "Retry status save" }).click();
  await expectText(page.getByLabel("Total earned XP"), "100 XP earned");
  pass(
    "status updates disable pending input, update XP without reload, and preserve committed state on failure/retry",
  );

  await row("Edited browser quest")
    .getByRole("button", { name: "View quest" })
    .click();
  await page.getByRole("button", { name: "Delete quest", exact: true }).click();
  await page.getByRole("button", { name: "Keep quest", exact: true }).click();
  await page.getByRole("button", { name: "Delete quest", exact: true }).click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await dialog.waitFor({ state: "hidden" });
  await row("Edited browser quest").waitFor({ state: "hidden" });
  pass(
    "delete cancellation preserves the quest; confirmation deletes and refreshes the roadmap",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/trees/1`);
  await forge.click();
  const box = await dialog.boundingBox();
  assert.equal(Math.round(box.width), 390);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({ path: resolve(output, "forge-mobile.png") });
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  const roadmapBox = await page.locator(".quest-list").boundingBox();
  const guidanceBox = await page.locator(".guidance").boundingBox();
  assert.ok(guidanceBox.y >= roadmapBox.y + roadmapBox.height);
  await page.screenshot({
    path: resolve(output, "tree-mobile.png"),
    fullPage: true,
  });
  pass("390px panes fill the viewport and the tree has no horizontal overflow");

  await page.setViewportSize({ width: 1280, height: 900 });
  let failTrees = true;
  await page.route("**/api/trees", (route) =>
    failTrees
      ? route.fulfill({
          status: 503,
          json: { error: "Temporary catalog failure" },
        })
      : route.continue(),
  );
  await page.goto(origin);
  await page.getByRole("button", { name: "Try again" }).waitFor();
  failTrees = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await page.locator(".tree-card").first().waitFor();
  await page.unroute("**/api/trees");
  pass("catalog failures show recovery and retry restores real database data");

  let releaseLoading;
  const loadingGate = new Promise((resolveGate) => {
    releaseLoading = resolveGate;
  });
  await page.route("**/api/trees", async (route) => {
    await loadingGate;
    await route.continue();
  });
  await page.goto(origin);
  await page.locator(".loading-state").waitFor();
  releaseLoading();
  await page.locator(".tree-card").first().waitFor();
  await page.unroute("**/api/trees");
  pass("loading feedback remains visible until the catalog request completes");

  await page.route("**/api/trees", (route) =>
    route.fulfill({
      json: {
        trees: [],
        summary: {
          total_xp: 0,
          total_quests: 0,
          completed_quests: 0,
          in_progress_quests: 0,
        },
        user: null,
      },
    }),
  );
  await page.goto(origin);
  await heading("New paths are on the way.").waitFor();
  await page.unroute("**/api/trees");
  await page.route("**/api/trees/888", (route) =>
    route.fulfill({
      json: {
        tree: {
          id: 888,
          title: "Empty track",
          description: "A fresh roadmap",
          quest_count: 0,
          completed_count: 0,
        },
        quests: [],
        user: null,
      },
    }),
  );
  await page.goto(`${origin}/trees/888`);
  await heading("A fresh canvas.").waitFor();
  assert.equal(
    await page.getByRole("progressbar").getAttribute("aria-valuetext"),
    "No quests yet",
  );
  assert.ok(!(await page.locator("body").innerText()).includes("NaN"));
  await page.unroute("**/api/trees/888");
  pass(
    "empty catalog and empty tree have useful states and safe completion indicators",
  );

  await page.goto(origin);
  await page.locator(".tree-card").first().waitFor();
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "skip-link",
  );
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.id), "main");
  pass("keyboard skip navigation moves focus directly to main content");

  await page.goto(`${origin}/trees/999999`);
  await page.getByRole("link", { name: "Back to skill trees" }).waitFor();
  await page.goto(`${origin}/missing-page`);
  await heading("Let’s find your path.").waitFor();
  await page.goto(`${origin}/dashboard`);
  await heading("Your developer dashboard").waitFor();
  await page
    .getByRole("link", { name: "HTML & CSS foundations", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("heading", { name: "HTML & CSS foundations", exact: true })
    .waitFor();
  assert.equal(new URL(page.url()).searchParams.get("quest"), "1");
  await page.getByRole("button", { name: "Close pane" }).click();
  assert.equal(new URL(page.url()).searchParams.has("quest"), false);
  await page.goto(`${origin}/trees/2?quest=1`);
  await page
    .getByRole("alert")
    .filter({ hasText: "no longer in this skill tree" })
    .waitFor();
  await page.getByRole("button", { name: "Dismiss", exact: true }).click();
  pass(
    "dashboard completion links open details and invalid deep links offer recovery",
  );

  await page.goto(`${origin}/dashboard`);
  await page
    .getByLabel("Dashboard earned XP")
    .filter({ hasText: "100" })
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Reset database", exact: true })
      .count(),
    0,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: resolve(output, "dashboard-mobile.png"),
    fullPage: true,
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  const dashboardColumns = await page
    .locator(".dashboard-columns")
    .evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
  assert.equal(dashboardColumns, 1);
  await page.setViewportSize({ width: 1280, height: 900 });
  pass(
    "dashboard shows private progress, hides admin tools from developers, and stacks on mobile",
  );

  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page
    .getByRole("button", { name: "Sign in with GitHub", exact: true })
    .waitFor();
  assert.equal(new URL(page.url()).pathname, "/");
  provider = "newcomer";
  await page.goto(`${origin}/dashboard`);
  await heading("Your developer dashboard").waitFor();
  await page
    .getByLabel("Dashboard earned XP")
    .filter({ hasText: "0" })
    .waitFor();
  await heading("Your first win belongs here.").waitFor();
  pass(
    "protected dashboard redirects to sign-in and new accounts have empty progress",
  );

  await page.route("**/api/me/progress", (route) =>
    route.fulfill({
      json: {
        summary: {
          total_xp: 0,
          total_quests: 0,
          completed_quests: 0,
          in_progress_quests: 0,
        },
        trees: [
          {
            id: 888,
            title: "Empty skill tree",
            quest_count: 0,
            completed_count: 0,
          },
        ],
        recent_completions: [],
      },
    }),
  );
  await page.reload();
  await page.getByText("No quests yet", { exact: true }).waitFor();
  assert.ok(!(await page.locator("body").innerText()).includes("NaN"));
  await page.unroute("**/api/me/progress");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page
    .getByRole("button", { name: "Sign in with GitHub", exact: true })
    .waitFor();
  const authorizationsBeforeCancel = authorizationCount;
  cancelSignIn = true;
  await page.goto(`${origin}/dashboard`);
  await page
    .locator(".feedback-panel")
    .getByRole("button", { name: "Sign in with GitHub", exact: true })
    .waitFor();
  assert.equal(new URL(page.url()).searchParams.get("authError"), "failed");
  assert.equal(authorizationCount, authorizationsBeforeCancel + 1);
  pass(
    "empty dashboard trees are safe and cancelled authentication offers retry without a redirect loop",
  );

  cancelSignIn = false;
  provider = "admin";
  await page
    .locator(".feedback-panel")
    .getByRole("button", { name: "Sign in with GitHub", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset database", exact: true })
    .waitFor();
  const temporaryResponse = await context.request.post(`${origin}/api/quests`, {
    data: {
      skill_tree_id: 1,
      title: "Reset browser fixture",
      description: "Temporary shared quest",
      requirements: "Remove with reset",
      difficulty: "beginner",
      xp_reward: 60,
      position: 4,
    },
  });
  assert.equal(temporaryResponse.status(), 201);
  const temporaryId = (await temporaryResponse.json()).quest.id;
  await page
    .getByRole("button", { name: "Reset database", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  assert.equal(
    (await context.request.get(`${origin}/api/quests/${temporaryId}`)).status(),
    200,
  );
  await page
    .getByRole("button", { name: "Reset database", exact: true })
    .click();
  await page.route("**/api/reset", (route) =>
    route.fulfill({ status: 503, json: { error: "Temporary reset failure" } }),
  );
  await page
    .getByRole("button", { name: "Reset to defaults", exact: true })
    .click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Temporary reset failure" })
    .waitFor();
  await page.unroute("**/api/reset");
  let releaseReset;
  const resetGate = new Promise((resolveGate) => {
    releaseReset = resolveGate;
  });
  await page.route("**/api/reset", async (route) => {
    await resetGate;
    await route.continue();
  });
  await page
    .getByRole("button", { name: "Reset to defaults", exact: true })
    .click();
  await page.getByRole("button", { name: "Resetting…", exact: true }).waitFor();
  assert.equal(
    await page.getByRole("button", { name: "Close pane" }).isDisabled(),
    true,
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Cancel", exact: true })
      .isDisabled(),
    true,
  );
  releaseReset();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page
    .getByText(
      "Database restored to defaults. Accounts and roles were preserved.",
      { exact: true },
    )
    .waitFor();
  await page.unroute("**/api/reset");
  assert.equal(
    (await context.request.get(`${origin}/api/quests/${temporaryId}`)).status(),
    404,
  );
  assert.equal(
    (await (await context.request.get(`${origin}/auth/me`)).json()).user.role,
    "admin",
  );
  pass(
    "admin reset supports cancellation, failure recovery, disabled pending controls, and preserved sessions",
  );

  await page.goto(origin);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page
    .getByRole("button", { name: "Sign in with GitHub", exact: true })
    .waitFor();
  await expectText(page.locator(".stat-value").first(), /0\s*XP/);
  await page.reload();
  await page
    .getByRole("button", { name: "Sign in with GitHub", exact: true })
    .waitFor();
  assert.equal((await context.request.get(`${origin}/auth/me`)).status(), 401);
  assert.deepEqual(errors, []);
  pass(
    "logout clears personal summaries, remains signed out on refresh, and no uncaught browser errors occur",
  );
  await writeFile(
    resolve(output, "checks.json"),
    JSON.stringify(
      {
        checks,
        browserErrors: errors,
        authentication:
          "simulated external provider; real Passport and PostgreSQL sessions",
        schemaIsolated: true,
      },
      null,
      2,
    ),
  );
  console.log(`${checks.length} M5 browser checks passed.`);
} catch (error) {
  if (page) {
    await page
      .screenshot({ path: resolve(output, "failure.png"), fullPage: true })
      .catch(() => {});
    console.log("Browser check failed at", page.url());
    console.log(
      (
        await page
          .locator("body")
          .innerText()
          .catch(() => "")
      ).slice(0, 1800),
    );
  }
  throw error;
} finally {
  await browser?.close();
  await vite?.close();
  if (apiServer)
    await new Promise((resolveClose) => apiServer.close(resolveClose));
  await app?.locals.sessionStore?.close();
  await pool?.end();
  if (/^skillforge_browser_[a-f0-9]{32}$/.test(schema))
    await adminPool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await adminPool.end();
}
