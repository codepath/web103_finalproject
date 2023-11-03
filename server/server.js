import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import leasesRouter from "./routes/leases.js";
import teneesRouter from "./routes/tenees.js";
import favoritesLeasesRouter from "./routes/favorites_leases.js";
import favoritesTeneesRouter from "./routes/favorites_tenees.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/leases", leasesRouter);
app.use("/api/tenees", teneesRouter);
app.use("/api/favorites_leases", favoritesLeasesRouter);
app.use("/api/favorites_tenees", favoritesTeneesRouter);

app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
