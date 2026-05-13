import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/db/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Indicamos que es una Promesa
) {
  try {
    // 1. ESPERAMOS a que los parámetros se resuelvan (Esto es lo que faltaba)
    const { id } = await params;

    console.log(" ID recuperado correctamente:", id);

    // 2. Ejecutamos el borrado
    await prisma.document.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error en el servidor al borrar:", error);
    return NextResponse.json(
      { success: false, message: "Error interno al intentar eliminar" },
      { status: 500 }
    );
  }
}