import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const output = resolve(".artifacts/m4");
const proof = JSON.parse(
  await readFile(resolve(output, "oauth-checks.json"), "utf8"),
);
assert.equal(proof.realGitHubSignIn, true, "Run npm run test:oauth first");
const origin = process.env.PREVIEW_URL ?? "http://127.0.0.1:5173";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ?? (existsSync(chrome) ? chrome : undefined),
});
let context, createdId;
try {
  context = await browser.newContext({
    storageState: resolve(output, "oauth-storage.json"),
    viewport: { width: 1120, height: 820 },
    reducedMotion: "reduce",
  });
  const me = await context.request.get(`${origin}/auth/me`);
  assert.equal(
    me.status(),
    200,
    "The real authenticated session must still be valid",
  );
  const user = (await me.json()).user;
  assert.ok(
    !user.github_username.endsWith("-demo"),
    "Record with a real GitHub account",
  );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const manifests = { crud: [], panes: [], status: [] };
  let sequence = 0;
  await mkdir(resolve(output, "frames"), { recursive: true });
  async function frame(groups, name, duration = 1800) {
    await page.evaluate(() => document.fonts.ready);
    const path = resolve(
      output,
      "frames",
      `${String(sequence++).padStart(2, "0")}-${name}.png`,
    );
    await page.screenshot({ path, animations: "disabled" });
    for (const group of groups) manifests[group].push({ path, duration });
  }
  const title = "Build a portfolio API";
  const updatedTitle = "Ship a tested portfolio API";
  const row = (name) =>
    page
      .locator(".quest-row")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
  await page.goto(`${origin}/trees/1`);
  await page
    .getByRole("button", { name: "Forge Quest", exact: true })
    .waitFor();
  await frame(["crud"], "roadmap");
  await page.getByRole("button", { name: "Forge Quest", exact: true }).click();
  await page.getByLabel("Title *", { exact: true }).fill(title);
  await page
    .getByLabel("Description *", { exact: true })
    .fill("Create a REST API to power a developer portfolio.");
  await page
    .getByLabel("Requirements *", { exact: true })
    .fill(
      "Add validated CRUD routes.\nPersist projects in PostgreSQL.\nCover permissions with integration tests.",
    );
  await page.getByLabel("Difficulty *").selectOption("intermediate");
  await page.getByLabel("XP reward *").fill("300");
  await page.getByLabel("Roadmap position *").fill("4");
  await page
    .getByLabel("Tags (comma-separated)")
    .fill("Express, PostgreSQL, Testing");
  await page
    .getByLabel("Documentation URLs (one per line)")
    .fill("https://expressjs.com/en/guide/routing.html");
  await page
    .getByLabel("Skill tree *")
    .getByRole("option", { name: "Frontend Mastery with React", exact: true })
    .waitFor({ state: "attached" });
  await page.getByRole("dialog").evaluate((element) => (element.scrollTop = 0));
  await frame(["crud", "panes"], "forge-form", 2400);
  const createdResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().endsWith("/api/quests"),
  );
  await page.getByRole("button", { name: "Create quest", exact: true }).click();
  createdId = (await (await createdResponse).json()).quest.id;
  await row(title).waitFor();
  await row(title).scrollIntoViewIfNeeded();
  await frame(["crud", "panes"], "created-quest");
  await row(title).getByRole("button", { name: "View quest" }).click();
  await page.getByRole("button", { name: "Edit quest", exact: true }).waitFor();
  await page.getByRole("dialog").evaluate((element) => (element.scrollTop = 0));
  await frame(["panes"], "full-details", 2400);
  await page
    .getByLabel("Notes", { exact: true })
    .fill("API design and test strategy recorded in the project README.");
  await page
    .getByLabel("Repository URL", { exact: true })
    .fill("https://github.com/bbdevelops/web103_finalproject");
  await page
    .getByRole("button", { name: "Save my progress", exact: true })
    .click();
  await page.locator(".toast-title", { hasText: "Progress saved" }).waitFor();
  await frame(["panes"], "saved-personal-progress");
  await page.getByRole("button", { name: "Edit quest", exact: true }).click();
  await page.getByLabel("Title *", { exact: true }).fill(updatedTitle);
  await page.getByRole("dialog").evaluate((element) => (element.scrollTop = 0));
  await frame(["crud", "panes"], "edit-quest");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await row(updatedTitle).waitFor();
  await row(updatedTitle).scrollIntoViewIfNeeded();
  await frame(["crud"], "updated-quest");
  await page.evaluate(() => scrollTo(0, 0));
  await frame(["status"], "progress-before");
  const status = row(updatedTitle).getByRole("combobox");
  await status.selectOption("in_progress");
  await page.waitForFunction(
    (title) =>
      [...document.querySelectorAll(".quest-row")].some(
        (element) =>
          element.textContent.includes(title) &&
          element.classList.contains("status-in_progress"),
      ),
    updatedTitle,
  );
  await row(updatedTitle).scrollIntoViewIfNeeded();
  await frame(["status"], "in-progress");
  const previousXP = (
    await (await context.request.get(`${origin}/api/me/progress`)).json()
  ).summary.total_xp;
  await status.selectOption("completed");
  await page
    .getByLabel("Total earned XP")
    .filter({ hasText: `${previousXP + 300} XP earned` })
    .waitFor();
  await frame(["status"], "quest-completed");
  await page.evaluate(() => scrollTo(0, 0));
  await frame(["status"], "xp-earned", 2300);
  await page.reload();
  await page
    .getByLabel("Total earned XP")
    .filter({ hasText: `${previousXP + 300} XP earned` })
    .waitFor();
  await frame(["status"], "refresh-persists");
  await status.selectOption("backlog");
  await page
    .getByLabel("Total earned XP")
    .filter({ hasText: `${previousXP} XP earned` })
    .waitFor();
  await page.evaluate(() => scrollTo(0, 0));
  await frame(["status"], "reopen-clears-award");
  await row(updatedTitle).getByRole("button", { name: "View quest" }).click();
  await page.getByRole("button", { name: "Delete quest", exact: true }).click();
  await frame(["crud"], "delete-confirmation", 2400);
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await row(updatedTitle).waitFor({ state: "hidden" });
  createdId = null;
  await page.evaluate(() => scrollTo(0, 0));
  await frame(["crud"], "deleted-quest");
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
        realGitHubSession: true,
        providerMocked: false,
        apiMocked: false,
        capturedFlows: Object.keys(manifests),
        testQuestRemoved: true,
        browserErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "Recorded three real-app feature walkthroughs; temporary quest and progress removed.",
  );
} finally {
  if (createdId && context)
    await context.request.delete(`${origin}/api/quests/${createdId}`);
  await browser.close();
}
