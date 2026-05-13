import React from "react";
import { AdminHeader } from "../AdminHeader";
import { UserList } from "../UserList";
import { prisma } from "@/infrastructure/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const usersList = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <AdminHeader
        title="Gestión de Usuarios"
        description="Administra los accesos y roles de la plataforma."
        userName="Admin"
        userInitials="AD"
      />
      <UserList users={usersList} />
    </div>
  );
}
