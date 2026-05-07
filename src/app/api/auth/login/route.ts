import { LoginUser } from "@/services/loginUser";
import { NextResponse } from "next/server";

/**
 * Endpoint para el inicio de sesión.
 * Configura los tokens en cookies HttpOnly para mayor seguridad.
 */
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        const { accessToken, refreshToken, user } = await LoginUser({ email, password });

        const response = NextResponse.json({
            message: "Inicio de sesión exitoso",
            user,
        });

        // Configurar Access Token en Cookie HttpOnly (15 min)
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60,
            path: "/",
        });

        // Configurar Refresh Token en Cookie HttpOnly (7 días)
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;

    } catch (error: unknown) {
        // Fix #1: Respuesta genérica siempre — evita user enumeration attacks.
        // El error interno se loguea pero NO se expone al cliente.
        console.error("[AUTH LOGIN]", error instanceof Error ? error.message : error);

        return NextResponse.json(
            { message: "Credenciales inválidas" },
            { status: 401 }
        );
    }
}