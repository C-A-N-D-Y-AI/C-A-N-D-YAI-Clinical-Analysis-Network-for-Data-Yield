import React from 'react';
import { AdminHeader } from '@/components/dashboard/AdminHeader';
import { UserList } from '@/components/dashboard/UserList';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Fix #10: Límite de 100 usuarios por página para evitar cargar toda la DB en memoria
const PAGE_SIZE = 100;

export default async function UsersPage() {
  const usersList = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: PAGE_SIZE,
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
