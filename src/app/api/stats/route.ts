import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// 10GB en Bytes
const MAX_STORAGE = 10 * 1024 * 1024 * 1024;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let userId: number;

    if (!token) {
      // Si no hay token, buscamos al primer usuario para que el dashboard no salga vacío
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) return NextResponse.json({ success: false }, { status: 404 });
      userId = firstUser.id;
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      userId = decoded.userId;
    }

    const totalDocuments = await prisma.document.count({ where: { userId } });

    const storage = await prisma.document.aggregate({
      where: { userId },
      _sum: { size: true },
    });

    const usedBytes = storage._sum.size ?? 0;
    const usedGB = usedBytes / (1024 ** 3);

    const availabilityPercent = Math.max(
      0, 
      100 - ((usedBytes / MAX_STORAGE) * 100) // Quitamos el round para más precisión
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments,
        storageUsedGB: usedGB.toFixed(2),
        storageLimitGB: 10,
        storagePercent: Number(availabilityPercent.toFixed(2)), 
      },
    });

  } catch (error) {
    console.error("Error en API Stats:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}