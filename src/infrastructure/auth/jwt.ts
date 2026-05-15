import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function getAccessSecret() {
  if (!ACCESS_SECRET) {
    throw new Error("FATAL: JWT_SECRET/JWT_ACCESS_SECRET debe estar definido.");
  }

  return ACCESS_SECRET;
}

function getRefreshSecret() {
  if (!REFRESH_SECRET) {
    throw new Error("FATAL: JWT_REFRESH_SECRET debe estar definido.");
  }

  return REFRESH_SECRET;
}

export interface JWTPayload {
  id?: number;
  userId?: number;
  email?: string;
  role: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: "1d" });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: "7d" });
}

export function validateAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getAccessSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

export function validateRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getRefreshSecret()) as JWTPayload;
  } catch {
    return null;
  }
}
