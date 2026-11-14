import "./env.js";
import jwt from "jsonwebtoken";

export const clientOrigin = new URL(
  process.env.CLIENT_URL || "http://localhost:5173",
).origin;
export const authCookie = "triptogether_token";
export const stateCookie = "triptogether_oauth_state";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api",
};
const issuer = "triptogether";
const audience = "triptogether-client";
function secret() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }
  return process.env.JWT_SECRET;
}
export function validateAuthConfig() {
  secret();
  for (const name of [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
  ]) {
    if (!process.env[name]) throw new Error(`${name} is required.`);
  }
}
export function signToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, secret(), {
    algorithm: "HS256",
    expiresIn,
    issuer,
    audience,
  });
}
export function verifyToken(token) {
  return jwt.verify(token, secret(), {
    algorithms: ["HS256"],
    issuer,
    audience,
  });
}
