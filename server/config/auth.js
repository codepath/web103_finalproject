import "./env.js";

export const clientOrigin = new URL(process.env.CLIENT_URL || "http://localhost:5173").origin;
export const authCookie = "triptogether_session";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api",
};
export function validateAuthConfig() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }
  for (const name of ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "GITHUB_CALLBACK_URL"]) {
    if (!process.env[name]?.trim()) throw new Error(`${name} is required.`);
  }
}
export function safeReturnTo(value) {
  return typeof value === "string" && /^\/trips(?:[/?#]|$)/.test(value)
    && !value.includes("\\") ? value : "/trips";
}
