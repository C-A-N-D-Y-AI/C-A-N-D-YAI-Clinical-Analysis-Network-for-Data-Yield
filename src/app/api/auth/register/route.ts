import { registerUser } from "@/services/registerUser";
import { NextResponse } from "next/server";

/**
 * Endpoint para el registro de nuevos usuarios.
 */
export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password } = await req.json();

        // Validación de campos obligatorios
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { message: "Todos los campos son obligatorios (nombre, apellido, email, contraseña)" },
                { status: 400 }
            );
        }

        // Validación de longitud de contraseña
        if (password.length < 6) {
            return NextResponse.json(
                { message: "La contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            );
        }

        await registerUser({ firstName, lastName, email, password });
        
        return NextResponse.json(
            { message: "Usuario registrado con éxito" },
            { status: 201 }
        );

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error inesperado";
        const statusCode = message.includes("existe") ? 409 : 500;

        return NextResponse.json(
            { message },
            { status: statusCode }
        );
    }
}