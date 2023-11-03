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

app.use("/users", usersRouter);
app.use("/leases", leasesRouter);
app.use("/tenees", teneesRouter);
app.use("/favorites_leases", favoritesLeasesRouter);
app.use("/favorites_tenees", favoritesTeneesRouter);

app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
