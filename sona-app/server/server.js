import express from "express";
import cors from "cors";
import "./config/dotenv.js";
import artistsRouter from "./routes/artists.js";
import usersRouter from "./routes/users.js";
import followsRouter from "./routes/follows.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/artists", artistsRouter);
app.use("/api/users", usersRouter);
app.use("/api/follows", followsRouter);

app.listen(PORT, () => {
  console.log(`Sona server running on http://localhost:${PORT}`);
});
