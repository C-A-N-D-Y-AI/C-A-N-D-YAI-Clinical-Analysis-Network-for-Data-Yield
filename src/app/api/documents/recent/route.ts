import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Si no hay token, intentamos buscar el primer usuario para la prueba
    if (!token) {
       const firstUser = await prisma.user.findFirst();
       if (!firstUser) return NextResponse.json({ success: false, documents: [] });
       
       const documents = await prisma.document.findMany({
         where: { userId: firstUser.id },
         orderBy: { createdAt: "desc" },
         take: 5,
       });
       return NextResponse.json({ success: true, documents });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const documents = await prisma.document.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({ success: true, documents: documents || [] });
  } catch (error) {
    console.error("Error en la API de documentos:", error);
    return NextResponse.json({ success: false, documents: [] }, { status: 200 }); 
    // Enviamos status 200 para que el frontend no crea que la ruta no existe
  }
}