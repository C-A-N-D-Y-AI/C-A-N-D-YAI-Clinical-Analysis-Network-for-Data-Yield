import jwt from "jsonwebtoken";

// 🔐 Falla fuerte si los secrets no están definidos — nunca deben tener fallback
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error(
        "FATAL: JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben estar definidos en las variables de entorno."
    );
}

export interface JWTPayload {
    id: number;
    email: string;
    role: string;
}

/** Genera un Access Token (válido 15 minutos) */
export function generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, ACCESS_SECRET!, { expiresIn: "15m" });
}

/** Genera un Refresh Token (válido 7 días) */
export function generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, REFRESH_SECRET!, { expiresIn: "7d" });
}

/** Valida un Access Token. Devuelve el payload o null si es inválido/expirado */
export function validateAccessToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, ACCESS_SECRET!) as JWTPayload;
    } catch {
        return null;
    }
}

/** Valida un Refresh Token. Devuelve el payload o null si es inválido/expirado */
export function validateRefreshToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, REFRESH_SECRET!) as JWTPayload;
    } catch {
        return null;
    }
}