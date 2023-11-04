import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import gamesRouter from "./routes/games.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());


app.use("/games", gamesRouter); 

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
