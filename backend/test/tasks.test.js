import "./setup.js";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import app from "../src/app.js";
import {
  getDemoUserId,
  getTaskIdByTitle,
  pool,
  resetDatabase,
} from "./helpers/testDatabase.js";

let server;
let baseUrl;
let demoUserId;

async function request(method, path, { body, rawBody } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: rawBody ?? (body === undefined ? undefined : JSON.stringify(body)),
  });
  const text = await response.text();

  return { status: response.status, body: text ? JSON.parse(text) : null };
}

function titlesOf(tasks) {
  return tasks.map((task) => task.title);
}

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await resetDatabase();
  demoUserId = await getDemoUserId();
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

describe("GET /api/health", () => {
  it("reports that the API is running", async () => {
    const response = await request("GET", "/api/health");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { status: "ok" });
  });
});

describe("unknown API routes", () => {
  it("returns 404 with a JSON error", async () => {
    const response = await request("GET", "/api/does-not-exist");

    assert.equal(response.status, 404);
    assert.equal(response.body.error, "Route not found.");
  });
});

describe("GET /api/tasks", () => {
  it("lists all tasks with their categories", async () => {
    const response = await request("GET", "/api/tasks");

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 4);

    const readingTask = response.body.find(
      (task) => task.title === "Review reading notes",
    );
    assert.deepEqual(
      readingTask.categories.map((category) => category.name),
      ["Learning", "Personal"],
    );
  });

  it("returns due dates as YYYY-MM-DD strings", async () => {
    const response = await request("GET", "/api/tasks");

    for (const task of response.body) {
      if (task.due_date !== null) {
        assert.match(task.due_date, /^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
});

describe("GET /api/tasks filtering", () => {
  it("filters by completion status", async () => {
    const incomplete = await request("GET", "/api/tasks?completed=false");
    const complete = await request("GET", "/api/tasks?completed=true");

    assert.equal(incomplete.status, 200);
    assert.equal(incomplete.body.length, 3);
    assert.ok(incomplete.body.every((task) => task.completed === false));
    assert.deepEqual(titlesOf(complete.body), ["Update resume"]);
  });

  it("filters by priority", async () => {
    const response = await request("GET", "/api/tasks?priority=high");

    assert.equal(response.status, 200);
    assert.deepEqual(titlesOf(response.body), ["Finish project outline"]);
  });

  it("filters by category name, case-insensitively, keeping all categories", async () => {
    const response = await request("GET", "/api/tasks?category=learning");

    assert.equal(response.status, 200);
    assert.deepEqual(titlesOf(response.body), ["Review reading notes"]);
    assert.equal(response.body[0].categories.length, 2);
  });

  it("returns an empty list when no task matches", async () => {
    const response = await request("GET", "/api/tasks?category=Finance");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  it("combines filters", async () => {
    const response = await request(
      "GET",
      "/api/tasks?completed=false&priority=low",
    );

    assert.equal(response.status, 200);
    assert.deepEqual(titlesOf(response.body), ["Plan workout"]);
  });

  for (const query of [
    "completed=yes",
    "priority=urgent",
    "category=",
    "unknown=1",
    "priority=high&priority=low",
  ]) {
    it(`rejects invalid filter "${query}" with 400`, async () => {
      const response = await request("GET", `/api/tasks?${query}`);

      assert.equal(response.status, 400);
      assert.equal(typeof response.body.error, "string");
    });
  }
});

describe("GET /api/tasks sorting", () => {
  it("sorts by due date with undated tasks last", async () => {
    const response = await request("GET", "/api/tasks?sort=due_date");

    assert.equal(response.status, 200);
    assert.deepEqual(titlesOf(response.body), [
      "Review reading notes",
      "Finish project outline",
      "Plan workout",
      "Update resume",
    ]);
  });

  it("sorts by priority from high to low by default", async () => {
    const response = await request("GET", "/api/tasks?sort=priority");

    assert.deepEqual(
      response.body.map((task) => task.priority),
      ["high", "medium", "low", "low"],
    );
  });

  it("sorts by priority from low to high with order=asc", async () => {
    const response = await request("GET", "/api/tasks?sort=priority&order=asc");

    assert.deepEqual(
      response.body.map((task) => task.priority),
      ["low", "low", "medium", "high"],
    );
  });

  it("sorts by title alphabetically, and reversed with order=desc", async () => {
    const ascending = await request("GET", "/api/tasks?sort=title");
    const descending = await request("GET", "/api/tasks?sort=title&order=desc");
    const expected = [
      "Finish project outline",
      "Plan workout",
      "Review reading notes",
      "Update resume",
    ];

    assert.deepEqual(titlesOf(ascending.body), expected);
    assert.deepEqual(titlesOf(descending.body), [...expected].reverse());
  });

  it("sorts by created date with the newest task first", async () => {
    await request("POST", "/api/tasks", {
      body: { title: "Newest task", user_id: demoUserId },
    });
    const response = await request("GET", "/api/tasks?sort=created_at");

    assert.equal(response.status, 200);
    assert.equal(response.body[0].title, "Newest task");
  });

  for (const query of ["sort=bogus", "order=asc", "sort=title&order=up"]) {
    it(`rejects invalid sorting "${query}" with 400`, async () => {
      const response = await request("GET", `/api/tasks?${query}`);

      assert.equal(response.status, 400);
    });
  }
});

describe("GET /api/tasks/:id", () => {
  it("returns a single task with its categories", async () => {
    const taskId = await getTaskIdByTitle("Review reading notes");
    const response = await request("GET", `/api/tasks/${taskId}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.id, taskId);
    assert.equal(response.body.title, "Review reading notes");
    assert.deepEqual(
      response.body.categories.map((category) => category.name),
      ["Learning", "Personal"],
    );
  });

  for (const invalidId of ["abc", "0", "-1", "1.5", "01", "99999999999"]) {
    it(`rejects invalid id "${invalidId}" with 400`, async () => {
      const response = await request("GET", `/api/tasks/${invalidId}`);

      assert.equal(response.status, 400);
      assert.equal(response.body.error, "Task id must be a positive integer.");
    });
  }

  it("returns 404 for a task that does not exist", async () => {
    const response = await request("GET", "/api/tasks/999999");

    assert.equal(response.status, 404);
    assert.equal(response.body.error, "Task not found.");
  });
});

describe("POST /api/tasks", () => {
  it("creates a task with defaults and returns 201", async () => {
    const response = await request("POST", "/api/tasks", {
      body: { title: "  Write tests  ", user_id: demoUserId },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.title, "Write tests");
    assert.equal(response.body.description, "");
    assert.equal(response.body.priority, "medium");
    assert.equal(response.body.due_date, null);
    assert.equal(response.body.completed, false);
    assert.equal(response.body.user_id, demoUserId);
    assert.deepEqual(response.body.categories, []);

    const fetched = await request("GET", `/api/tasks/${response.body.id}`);
    assert.equal(fetched.status, 200);
    assert.equal(fetched.body.title, "Write tests");
  });

  it("creates a task with every field provided", async () => {
    const response = await request("POST", "/api/tasks", {
      body: {
        title: "Submit milestone",
        description: "Upload the final docs.",
        priority: "high",
        due_date: "2026-12-31",
        completed: true,
        user_id: demoUserId,
      },
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.priority, "high");
    assert.equal(response.body.due_date, "2026-12-31");
    assert.equal(response.body.completed, true);
  });

  const invalidBodies = [
    ["a blank title", { title: "   " }, "Task title is required."],
    ["a missing title", {}, "Task title is required."],
    ["a non-string title", { title: 42 }, "Task title is required."],
    [
      "an invalid priority",
      { title: "Task", priority: "urgent" },
      "Task priority must be one of: low, medium, high.",
    ],
    ["an impossible date", { title: "Task", due_date: "2026-02-30" }],
    ["a non-ISO date", { title: "Task", due_date: "12/31/2026" }],
    ["a string completed value", { title: "Task", completed: "true" }],
    ["an unknown field", { title: "Task", color: "red" }],
  ];

  for (const [description, fields, expectedError] of invalidBodies) {
    it(`rejects ${description} with 400`, async () => {
      const response = await request("POST", "/api/tasks", {
        body: { user_id: demoUserId, ...fields },
      });

      assert.equal(response.status, 400);
      if (expectedError) {
        assert.equal(response.body.error, expectedError);
      } else {
        assert.equal(typeof response.body.error, "string");
      }
    });
  }

  it("rejects a missing or invalid user_id with 400", async () => {
    for (const userId of [undefined, "abc", 0, -3]) {
      const response = await request("POST", "/api/tasks", {
        body: { title: "Task", user_id: userId },
      });

      assert.equal(response.status, 400, `user_id ${userId}`);
    }
  });

  it("rejects a user_id that does not exist with 400", async () => {
    const response = await request("POST", "/api/tasks", {
      body: { title: "Task", user_id: 999999 },
    });

    assert.equal(response.status, 400);
    assert.equal(
      response.body.error,
      "Task user_id does not match an existing user.",
    );
  });

  it("rejects a non-object JSON body with 400", async () => {
    const response = await request("POST", "/api/tasks", { body: ["Task"] });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, "Request body must be a JSON object.");
  });

  it("rejects malformed JSON with 400", async () => {
    const response = await request("POST", "/api/tasks", {
      rawBody: '{"title": ',
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, "Request body must be valid JSON.");
  });

  it("does not create anything when validation fails", async () => {
    await request("POST", "/api/tasks", {
      body: { title: "", user_id: demoUserId },
    });
    const response = await request("GET", "/api/tasks");

    assert.equal(response.body.length, 4);
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("updates only the fields provided", async () => {
    const taskId = await getTaskIdByTitle("Finish project outline");
    const before = await request("GET", `/api/tasks/${taskId}`);
    const response = await request("PATCH", `/api/tasks/${taskId}`, {
      body: { completed: true },
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.completed, true);
    assert.equal(response.body.title, before.body.title);
    assert.equal(response.body.priority, before.body.priority);
    assert.equal(response.body.due_date, before.body.due_date);
    assert.equal(response.body.description, before.body.description);
  });

  it("updates several fields and keeps categories in the response", async () => {
    const taskId = await getTaskIdByTitle("Review reading notes");
    const response = await request("PATCH", `/api/tasks/${taskId}`, {
      body: {
        title: "Review chapter notes",
        priority: "high",
        due_date: "2027-01-15",
      },
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.title, "Review chapter notes");
    assert.equal(response.body.priority, "high");
    assert.equal(response.body.due_date, "2027-01-15");
    assert.equal(response.body.categories.length, 2);
  });

  it("clears due_date when it is set to null", async () => {
    const taskId = await getTaskIdByTitle("Plan workout");
    const response = await request("PATCH", `/api/tasks/${taskId}`, {
      body: { due_date: null },
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.due_date, null);
  });

  it("can mark a completed task as incomplete", async () => {
    const taskId = await getTaskIdByTitle("Update resume");
    const response = await request("PATCH", `/api/tasks/${taskId}`, {
      body: { completed: false },
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.completed, false);
  });

  const invalidUpdates = [
    ["an empty body", {}],
    ["a blank title", { title: "  " }],
    ["a null title", { title: null }],
    ["an invalid priority", { priority: "critical" }],
    ["an invalid date", { due_date: "tomorrow" }],
    ["a numeric completed value", { completed: 1 }],
    ["a read-only user_id", { user_id: 2 }],
    ["a read-only id", { id: 10 }],
  ];

  for (const [description, body] of invalidUpdates) {
    it(`rejects ${description} with 400 and leaves the task unchanged`, async () => {
      const taskId = await getTaskIdByTitle("Finish project outline");
      const before = await request("GET", `/api/tasks/${taskId}`);
      const response = await request("PATCH", `/api/tasks/${taskId}`, {
        body,
      });
      const after = await request("GET", `/api/tasks/${taskId}`);

      assert.equal(response.status, 400);
      assert.equal(typeof response.body.error, "string");
      assert.deepEqual(after.body, before.body);
    });
  }

  it("rejects an invalid id with 400", async () => {
    const response = await request("PATCH", "/api/tasks/abc", {
      body: { title: "Task" },
    });

    assert.equal(response.status, 400);
  });

  it("returns 404 for a task that does not exist", async () => {
    const response = await request("PATCH", "/api/tasks/999999", {
      body: { title: "Task" },
    });

    assert.equal(response.status, 404);
    assert.equal(response.body.error, "Task not found.");
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes a task and returns 204 with no body", async () => {
    const taskId = await getTaskIdByTitle("Review reading notes");
    const response = await request("DELETE", `/api/tasks/${taskId}`);

    assert.equal(response.status, 204);
    assert.equal(response.body, null);

    const fetched = await request("GET", `/api/tasks/${taskId}`);
    assert.equal(fetched.status, 404);

    const links = await pool.query(
      "SELECT 1 FROM task_categories WHERE task_id = $1",
      [taskId],
    );
    assert.equal(links.rowCount, 0);
  });

  it("returns 404 when the task does not exist", async () => {
    const response = await request("DELETE", "/api/tasks/999999");

    assert.equal(response.status, 404);
    assert.equal(response.body.error, "Task not found.");
  });

  it("returns 404 when deleting the same task twice", async () => {
    const taskId = await getTaskIdByTitle("Plan workout");
    await request("DELETE", `/api/tasks/${taskId}`);
    const response = await request("DELETE", `/api/tasks/${taskId}`);

    assert.equal(response.status, 404);
  });

  it("rejects an invalid id with 400", async () => {
    const response = await request("DELETE", "/api/tasks/xyz");

    assert.equal(response.status, 400);
  });
});
