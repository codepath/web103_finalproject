import express from "express";
import taskRouter from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/tasks", taskRouter);

app.use("/api", (_request, response) => {
  response.status(404).json({ error: "Route not found." });
});

app.use((error, _request, response, _next) => {
  // Malformed JSON bodies are client errors, not server failures.
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({ error: "Request body must be valid JSON." });
  }

  // Other body-parser errors (e.g. payload too large) carry a safe 4xx status.
  if (error.expose && error.status >= 400 && error.status < 500) {
    return response.status(error.status).json({ error: error.message });
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

export default app;
