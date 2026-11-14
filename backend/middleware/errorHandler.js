export function notFound(_req, res) {
  res.status(404).json({ error: "Not found." });
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
}
