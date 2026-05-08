import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Aumentamos el tiempo a 1 día para que no te de 401 mientras pruebas
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" } 
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // ARREGLO CLAVE: Agregamos success: true para que el DashboardRedirect lo lea
    const response = NextResponse.json({
      success: true, 
      message: "Login exitoso",
      user: {
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}