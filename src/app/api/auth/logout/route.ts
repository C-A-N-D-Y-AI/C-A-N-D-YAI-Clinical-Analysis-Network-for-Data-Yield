import { NextResponse } from "next/server";

/**
 * Endpoint para cerrar sesión.
 * Borra las cookies de autenticación.
 */
export async function POST() {
    const response = NextResponse.json({ message: "Sesión cerrada exitosamente" });

    // Borrar cookies estableciendo su fecha de expiración en el pasado
    response.cookies.set("accessToken", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return response;
}
