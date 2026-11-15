import express from "express";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const clientDirectory = fileURLToPath(new URL("../../client/dist/", import.meta.url));

export function serveClient(app, directory = clientDirectory) {
  const index = join(directory, "index.html");
  if (!existsSync(index)) {
    throw new Error("Client build is missing. Run npm run build from the repository root first.");
  }

  app.use("/assets", express.static(join(directory, "assets"), {
    maxAge: "1y",
    immutable: true,
    index: false,
  }));
  app.use(express.static(directory, { index: false, maxAge: 0 }));
  // React Router handles browser page routes, including a direct refresh.
  // Missing assets and API routes must never receive the HTML shell.
  app.get(/.*/, (req, res, next) => {
    if (req.path === "/api" || req.path.startsWith("/api/")
      || req.path.startsWith("/assets/") || extname(req.path)
      || !req.accepts("html")) return next();
    res.set("Cache-Control", "no-cache");
    res.sendFile(index);
  });
}
