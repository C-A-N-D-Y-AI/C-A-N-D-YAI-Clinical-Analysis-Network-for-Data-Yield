import React from 'react';
import { AdminHeader } from '@/components/dashboard/AdminHeader';
import { MonthlyActivityChart } from '@/components/dashboard/MonthlyActivityChart';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Obtener todos los usuarios (solo la fecha de creación para no cargar toda la DB)
  const users = await prisma.user.findMany({
    select: { createdAt: true }
  });

  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const months: { year: number; month: number; label: string; count: number }[] = [];
  const currentDate = new Date();
  
  // Generar la estructura de los últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: monthNames[d.getMonth()],
      count: 0
    });
  }

  // Agrupar los usuarios reales por el mes en que fueron creados
  users.forEach(u => {
    const y = u.createdAt.getFullYear();
    const m = u.createdAt.getMonth();
    
    const match = months.find(x => x.year === y && x.month === m);
    if (match) {
      match.count++;
    }
  });

  // Formatear la data para el gráfico
  const chartData = months.map(m => ({
    label: m.label,
    value: m.count
  }));

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Encabezado */}
      <AdminHeader 
        title="Panel de Administración" 
        description="Bienvenido al centro de control. Utiliza el menú superior para ver detalles completos."
        userName="Admin"
        userInitials="AD"
      />

      <div className="w-full">
        <MonthlyActivityChart data={chartData} />
      </div>
    </div>
  );
}
