import { validateRefreshToken, generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Endpoint para refrescar los tokens de acceso.
 * Utiliza el refreshToken guardado en las cookies para generar un nuevo par de tokens.
 */
export async function POST() {
    try {
        const cookieStore = await cookies();
        const oldRefreshToken = cookieStore.get("refreshToken")?.value;

        if (!oldRefreshToken) {
            return NextResponse.json(
                { message: "No hay token de refresco" },
                { status: 401 }
            );
        }

        const payload = validateRefreshToken(oldRefreshToken);

        if (!payload) {
            return NextResponse.json(
                { message: "Token de refresco inválido o expirado" },
                { status: 401 }
            );
        }

        // Generar nuevos tokens (Token Rotation)
        const newPayload = { 
            id: payload.id, 
            email: payload.email, 
            role: payload.role 
        };
        const accessToken = generateAccessToken(newPayload);
        const refreshToken = generateRefreshToken(newPayload);

        const response = NextResponse.json({ message: "Token refrescado con éxito" });

        // Actualizar cookies
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60,
            path: "/",
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;

    } catch (_error) {
        return NextResponse.json(
            { message: "Error al refrescar el token" },
            { status: 500 }
        );
    }
}
