import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

//start server

const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
