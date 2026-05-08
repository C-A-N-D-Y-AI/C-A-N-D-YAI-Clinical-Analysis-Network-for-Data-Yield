import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "FATAL: JWT_SECRET/JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben estar definidos."
  );
}

export interface JWTPayload {
  id?: number;
  userId?: number;
  email?: string;
  role: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, ACCESS_SECRET!, { expiresIn: "1d" });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET!, { expiresIn: "7d" });
}

export function validateAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}

export function validateRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}
