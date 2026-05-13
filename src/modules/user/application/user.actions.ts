"use server";

import { prisma } from "@/infrastructure/db/prisma";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/infrastructure/security/hash";
import { User } from "@/modules/user/types/user";
import { cookies } from "next/headers";
import { validateAccessToken } from "@/infrastructure/auth/jwt";

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = token ? validateAccessToken(token) : null;

  if (!user || user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }
}

const ADMIN_PATHS = [
  "/admin-dashboard",
  "/admin-dashboard/users",
  "/admin-dashboard/estadisticas",
];

function revalidateAdminPaths() {
  ADMIN_PATHS.forEach((path) => revalidatePath(path));
}

export async function deleteUser(userId: number) {
  await requireAdmin();

  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidateAdminPaths();
    return { success: true };
  } catch (error) {
    console.error("[ACTION deleteUser]", error);
    return { success: false, error: "No se pudo eliminar el usuario" };
  }
}

export async function createUser(data: Omit<User, "id">) {
  await requireAdmin();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return { success: false, error: "El usuario con ese email ya existe" };
    }

    if (!data.password) {
      return { success: false, error: "La contraseña es obligatoria" };
    }

    const hashed = await hashPassword(data.password);

    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.firstName + " " + data.lastName,
        email: data.email,
        password: hashed,
        role: data.role || "USER",
        isActive: data.isActive ?? true,
        status: "active",
      },
    });

    revalidateAdminPaths();
    return { success: true };
  } catch (error) {
    console.error("[ACTION createUser]", error);
    return { success: false, error: "No se pudo crear el usuario" };
  }
}

export async function updateUser(userId: number, data: Partial<User>) {
  await requireAdmin();

  try {
    const updateData: {
      firstName?: string;
      lastName?: string;
      name?: string;
      email?: string;
      role?: "USER" | "ADMIN";
      isActive?: boolean;
      password?: string;
    } = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role as "USER" | "ADMIN" | undefined,
      isActive: data.isActive,
    };

    if (data.firstName || data.lastName) {
      updateData.name =
        (data.firstName || "") + " " + (data.lastName || "");
    }

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    await prisma.user.update({ where: { id: userId }, data: updateData });
    revalidateAdminPaths();
    return { success: true };
  } catch (error) {
    console.error("[ACTION updateUser]", error);
    return { success: false, error: "No se pudo actualizar el usuario" };
  }
}