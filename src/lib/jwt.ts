import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

//generar el accesstoken, verificarlo
//corto 15 min
export function generateAccessToken(payload: object) {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m"
    });
}

//refreshtoken
export function generateRefreshToken(payload: object) {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d"
    });
}

//validar accesstoken
export function validateAccesToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET);
}

//validar refreshtoken
export function validateRefresjToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET);
}