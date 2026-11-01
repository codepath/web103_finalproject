import express from "express";
import taskRouter from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/tasks", taskRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

export default app;