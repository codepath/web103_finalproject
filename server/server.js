import express from "express";
import cors from "cors";
import pool from "./config/database.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//simple manual test
app.get("/trips", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trips");
    res.json(result.rows);
  } catch (error) {
    console.log("Error fetching trips", error);
    res.status(500).send("Error fetching trips");
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//start server

const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
