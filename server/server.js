import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
app.use(cors);

dotenv.config();

const port = process.env.PORT;

app.listen(() => console.log(`Listening on Port: ${port}`));
