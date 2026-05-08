import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    
    // Intento 1: Obtener desde cookieStore (Next.js way)
    let token = cookieStore.get("auth_token")?.value;

    // Intento 2: Si el Intento 1 falló (el 401 que ves), leer el Header directamente
    if (!token) {
      const rawCookie = req.headers.get("cookie");
      token = rawCookie?.split("auth_token=")[1]?.split(";")[0];
    }

    if (!token) {
      console.log(" Token no encontrado en cookies ni headers");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const userId = Number(decoded.userId);

    // Ejecutar la purga en la base de datos
    await prisma.document.deleteMany({ where: { userId: userId } });
    await prisma.user.delete({ where: { id: userId } });

    // Crear respuesta y limpiar la cookie manualmente
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", "", { 
      path: "/", 
      expires: new Date(0),
      httpOnly: true 
    });

    return response;
  } catch (error: unknown) {
    console.error("Error en DELETE:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}