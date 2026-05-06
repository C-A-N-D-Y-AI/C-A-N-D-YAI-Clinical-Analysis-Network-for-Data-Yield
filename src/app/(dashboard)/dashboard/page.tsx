import React from 'react';
import { AdminHeader } from '@/components/dashboard/AdminHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { UserList } from '@/components/dashboard/UserList';
import prisma from '@/lib/db';

export default async function DashboardPage() {
  // Consultas a la base de datos
  const totalUsers = await prisma.user.count();
  const activeUsers = await prisma.user.count({
    where: { isActive: true }
  });

  // Traer todos los usuarios (en un caso real se paginaría)
  const usersList = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Encabezado */}
      <AdminHeader 
        title="Panel de Administración" 
        description="Bienvenido al centro de control. Aquí tienes un resumen del sistema."
        userName="Admin"
        userInitials="AD"
      />

      {/* Tarjetas de Resumen (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Usuarios Activos" 
          value={activeUsers} 
          colorScheme="blue" 
        />
        <StatCard 
          title="Total Usuarios" 
          value={totalUsers} 
          colorScheme="purple" 
        />
        <StatCard 
          title="Salud del Sistema" 
          value="98%" 
          colorScheme="green" 
        />
      </div>

      {/* Lista de Usuarios de la BD */}
      <UserList users={usersList} />
    </div>
  );
}
