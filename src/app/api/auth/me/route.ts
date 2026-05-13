import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/infrastructure/db/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("accessToken")?.value;

    console.log("TOKEN:", token); 

    if (!token) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    if (!user || user.status !== "active") {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("[ME ERROR]", error);
    return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
  }
}