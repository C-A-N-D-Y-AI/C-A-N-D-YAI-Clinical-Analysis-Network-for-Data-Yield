import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "default_access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

export interface JWTPayload {
    id: number;
    email: string;
    role: string;
}

/**
 * Generates an Access Token (Valid for 15 minutes)
 */
export function generateAccessToken(payload: JWTPayload) {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m"
    });
}

/**
 * Generates a Refresh Token (Valid for 7 days)
 */
export function generateRefreshToken(payload: JWTPayload) {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d"
    });
}

/**
 * Validates an Access Token
 */
export function validateAccessToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}

/**
 * Validates a Refresh Token
 */
export function validateRefreshToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}