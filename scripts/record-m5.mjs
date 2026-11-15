import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "playwright";

const output = resolve(".artifacts/m5");
const proof = (name) =>
  readFile(resolve(output, name), "utf8").then(JSON.parse);
const deployed = await proof("deployment-checks.json");
const oauth = await proof("oauth-checks.json");
const backup = await proof("backups/latest.json");
assert.ok(
  deployed.passed && oauth.realGitHubSignIn && oauth.origin === deployed.origin,
);
assert.ok(
  existsSync(backup.file) &&
    Date.now() - Date.parse(backup.createdAt) < 86400000,
  "Create a fresh private backup before recording reset.",
);
assert.equal(
  createHash("sha256")
    .update(await readFile(backup.file))
    .digest("hex"),
  backup.sha256,
);
const origin = deployed.origin;
assert.ok(
  origin.startsWith("https://"),
  "Final evidence requires the deployed HTTPS application.",
);
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const context = await chromium.launchPersistentContext(
  resolve(output, "oauth-profile"),
  {
    executablePath:
      process.env.CHROME_PATH ?? (existsSync(chrome) ? chrome : undefined),
    headless: false,
    chromiumSandbox: true,
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  },
);
const manifests = { dashboard: [], reset: [], filters: [], final: [] },
  created = new Set();
const errors = [];
let resetDone = false,
  sequence = 0;
try {
  const page = context.pages()[0] ?? (await context.newPage());
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(180000);
  page.on("pageerror", (error) => errors.push(error.message));
  const me = await context.request.get(`${origin}/auth/me`);
  assert.equal(me.status(), 200, "Run the real OAuth check first.");
  assert.equal(
    (await me.json()).user.role,
    "admin",
    "Provision the approved owner identity first.",
  );
  await mkdir(resolve(output, "frames"), { recursive: true });
  async function frame(groups, label, duration = 1800) {
    await page.evaluate(() => document.fonts.ready);
    const path = resolve(
      output,
      "frames",
      `${String(sequence++).padStart(2, "0")}-${label}.png`,
    );
    await page.screenshot({ path, animations: "disabled" });
    for (const group of new Set([...groups, "final"]))
      manifests[group].push({ path, duration });
  }
  const row = (title) =>
    page
      .locator(".quest-row")
      .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  const button = (name) => page.getByRole("button", { name, exact: true });
  await context.request.post(`${origin}/auth/logout`);
  await page.goto(origin);
  await page.locator(".tree-card").first().waitFor();
  await frame([], "public-explorer");
  await page.getByRole("link", { name: /Frontend Mastery with React/ }).click();
  await page
    .locator(".quest-row")
    .first()
    .getByRole("button", { name: "View quest" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("heading", { name: "Requirements", exact: true })
    .waitFor();
  assert.equal(await button("Edit quest").count(), 0);
  await frame([], "guest-read-only-details");
  await button("Close pane").click();
  await page.goto(`${origin}/dashboard`);
  console.log(
    "Complete any GitHub prompt in Chrome; only application pages are captured.",
  );
  await page
    .getByRole("heading", { name: "Your developer dashboard", exact: true })
    .waitFor({ timeout: 600000 });
  await frame(["dashboard"], "protected-dashboard", 2400);
  // Make real loading/pending states readable in the recording without mocking responses.
  const network = await context.newCDPSession(page);
  await network.send("Network.enable");
  await network.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 1000,
    downloadThroughput: 125000,
    uploadThroughput: 62500,
    connectionType: "cellular3g",
  });
  await page
    .getByRole("link", { name: "Explore skill trees", exact: true })
    .click();
  await page.getByRole("link", { name: /Frontend Mastery with React/ }).click();
  await button("Forge Quest").click();
  const title = "Ship a tested portfolio",
    edited = "Ship a tested full-stack portfolio";
  await page.getByLabel("Title *", { exact: true }).fill(title);
  await page
    .getByLabel("Description *", { exact: true })
    .fill("Build a portfolio with a reliable API and an accessible interface.");
  await page
    .getByLabel("Requirements *", { exact: true })
    .fill(
      "Persist projects in PostgreSQL.\nValidate inputs and test ownership.\nDeploy the full stack on Render.",
    );
  await page.getByLabel("Difficulty *").selectOption("intermediate");
  await page.getByLabel("XP reward *").fill("300");
  await page.getByLabel("Roadmap position *").fill("4");
  await page
    .getByLabel("Tags (comma-separated)")
    .fill("React, Express, PostgreSQL");
  await page
    .getByLabel("Documentation URLs (one per line)")
    .fill("javascript:invalid-link");
  const invalidReply = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().endsWith("/api/quests"),
  );
  await button("Create quest").click();
  assert.equal((await invalidReply).status(), 400);
  await page
    .locator(".field-error")
    .filter({ hasText: "HTTP or HTTPS" })
    .waitFor();
  await frame([], "rejected-invalid-input", 2400);
  await page
    .getByLabel("Documentation URLs (one per line)")
    .fill("https://react.dev/learn");
  const createReply = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().endsWith("/api/quests"),
  );
  await button("Create quest").click();
  await button("Saving…").waitFor();
  assert.equal(
    await page.getByLabel("Title *", { exact: true }).isDisabled(),
    true,
  );
  await frame([], "submission-pending");
  const questId = (await (await createReply).json()).quest.id;
  created.add(questId);
  await row(title).waitFor();
  await row(title).scrollIntoViewIfNeeded();
  await frame([], "quest-created");
  await row(title).getByRole("button", { name: "View quest" }).click();
  await page
    .getByLabel("Notes", { exact: true })
    .fill("Validated and deployed with integration and browser checks.");
  await page
    .getByLabel("Repository URL", { exact: true })
    .fill("https://github.com/bbdevelops/web103_finalproject");
  await button("Save my progress").click();
  await page.locator(".toast-title", { hasText: "Progress saved" }).waitFor();
  await frame([], "personal-progress-saved");
  await button("Edit quest").click();
  await page.getByLabel("Title *", { exact: true }).fill(edited);
  await page.getByRole("dialog").evaluate((element) => (element.scrollTop = 0));
  await frame([], "edit-shared-quest");
  await button("Save changes").click();
  await row(edited).waitFor();
  await row(edited).getByRole("combobox").selectOption("completed");
  await row(edited).getByText("Saving…", { exact: true }).waitFor();
  await frame([], "status-save-pending");
  await row(edited).locator(".status-badge.completed").waitFor();
  await frame([], "quest-completed");
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await page.locator(".loading-state").waitFor();
  await frame(["dashboard"], "dashboard-loading");
  await page.getByRole("link", { name: edited, exact: true }).waitFor();
  await frame(["dashboard"], "earned-xp-and-history", 2400);
  await page.reload();
  await page.getByRole("link", { name: edited, exact: true }).waitFor();
  await frame(["dashboard"], "dashboard-persists");
  await page.getByRole("link", { name: edited, exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("heading", { name: edited, exact: true })
    .waitFor();
  await frame(["dashboard"], "recent-quest-deep-link");
  await button("Close pane").click();
  await page.evaluate(() => scrollTo(0, 0));
  await frame(["filters"], "full-roadmap");
  await page
    .getByLabel("Difficulty", { exact: true })
    .selectOption("intermediate");
  await page.getByLabel("My status", { exact: true }).selectOption("completed");
  await row(edited).waitFor();
  await frame(["filters"], "combined-filters", 2200);
  const quests = (
    await (await context.request.get(`${origin}/api/trees/1`)).json()
  ).quests;
  const empty = ["beginner", "intermediate", "advanced"]
    .flatMap((difficulty) =>
      ["backlog", "in_progress", "completed"].map((status) => ({
        difficulty,
        status,
      })),
    )
    .find(
      (pair) =>
        !quests.some(
          (quest) =>
            quest.difficulty === pair.difficulty &&
            quest.status === pair.status,
        ),
    );
  if (empty) {
    await page
      .getByLabel("Difficulty", { exact: true })
      .selectOption(empty.difficulty);
    await page
      .getByLabel("My status", { exact: true })
      .selectOption(empty.status);
    await page
      .getByRole("heading", {
        name: "No quests match these filters.",
        exact: true,
      })
      .waitFor();
    await frame(["filters"], "empty-filter-results");
  }
  await button("Clear filters").click();
  await page.getByLabel("Sort quests", { exact: true }).selectOption("xp");
  await row(edited).waitFor();
  await frame(["filters"], "highest-xp-first");
  await button("Clear filters").click();
  await row(edited).getByRole("button", { name: "View quest" }).click();
  await button("Delete quest").click();
  await frame([], "delete-confirmation");
  await button("Confirm delete").click();
  await row(edited).waitFor({ state: "hidden" });
  created.delete(questId);
  await frame([], "quest-deleted");
  const sample = await context.request.post(`${origin}/api/quests`, {
    data: {
      skill_tree_id: 1,
      title: "Reset demonstration quest",
      description:
        "Temporary content for the owner-confirmed reset walkthrough.",
      requirements: "Restore defaults after backing up current data.",
      difficulty: "beginner",
      xp_reward: 75,
      position: 4,
    },
  });
  assert.equal(sample.status(), 201);
  const sampleId = (await sample.json()).quest.id;
  created.add(sampleId);
  assert.equal(
    (
      await context.request.put(`${origin}/api/quests/${sampleId}/progress`, {
        data: {
          status: "completed",
          notes: "Temporary demonstration progress",
        },
      })
    ).status(),
    200,
  );
  await page.goto(`${origin}/dashboard`);
  await page
    .getByRole("link", { name: "Reset demonstration quest", exact: true })
    .waitFor();
  await frame(["reset"], "before-global-reset");
  await button("Reset database").click();
  await page.getByRole("dialog").waitFor();
  await frame(["reset"], "global-reset-confirmation", 2800);
  console.log(
    "OWNER CHECKPOINT: backup is verified. Read the warning in Chrome, then click Reset to defaults when ready. The recorder will not click it for you.",
  );
  await page.bringToFront();
  await button("Resetting…").waitFor({ timeout: 0 });
  await frame(["reset"], "reset-in-progress");
  await page
    .getByText(
      "Database restored to defaults. Accounts and roles were preserved.",
      { exact: true },
    )
    .waitFor({ timeout: 600000 });
  resetDone = true;
  created.clear();
  const after = await (
    await context.request.get(`${origin}/api/me/progress`)
  ).json();
  assert.equal(after.summary.total_quests, 12);
  assert.equal(after.summary.total_xp, 0);
  assert.equal(
    (await (await context.request.get(`${origin}/auth/me`)).json()).user.role,
    "admin",
  );
  await page
    .getByLabel("Dashboard earned XP")
    .filter({ hasText: /^0\s*XP$/ })
    .waitFor();
  await frame(["reset"], "defaults-restored", 2400);
  await button("Sign out").click();
  await button("Sign in with GitHub").waitFor();
  await page.locator(".tree-card").first().waitFor();
  await frame([], "signed-out");
  assert.deepEqual(errors, []);
  for (const [name, frames] of Object.entries(manifests))
    await writeFile(
      resolve(output, `${name}-frames.json`),
      JSON.stringify(frames, null, 2),
    );
  await writeFile(
    resolve(output, "recording-checks.json"),
    JSON.stringify(
      {
        origin,
        realGitHubSession: true,
        apiMocked: false,
        controlledNetworkLatency: true,
        invalidInputRejected: true,
        ownerConfirmedReset: true,
        backupSha256: backup.sha256,
        defaultCatalogVerified: true,
        flows: Object.keys(manifests),
        browserErrors: errors,
        recordedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS deployed walkthrough, three feature recordings, owner-confirmed reset, and logout.",
  );
} finally {
  if (!resetDone)
    for (const id of created)
      await context.request
        .delete(`${origin}/api/quests/${id}`)
        .catch(() => {});
  await context.close();
}
