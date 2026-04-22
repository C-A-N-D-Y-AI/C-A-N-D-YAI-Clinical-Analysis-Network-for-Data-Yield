import { LoginUser } from "@/services/loginUser";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json(
                { message: "Campos requeridos" },
                { status: 400 }
            );
        }
        const token = await LoginUser({ email, password });

        return NextResponse.json(token);

    } catch (error: unknown) {

        const message = error instanceof Error ? error.message : "Error inesperado";

        return NextResponse.json(
            { message },
            { status: 401 }
        );
    }
}