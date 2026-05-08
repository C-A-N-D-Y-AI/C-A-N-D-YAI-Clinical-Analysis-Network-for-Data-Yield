import React from "react";
import { AdminHeader } from "../AdminHeader";
import { StatCard } from "../StatCard";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EstadisticasPage() {
  const [totalUsers, activeUsers, adminUsers, activeSessions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
  ]);

  return (
    <div className="w-full flex flex-col gap-8">
      <AdminHeader
        title="Estadísticas del Sistema"
        description="Métricas y KPIs del funcionamiento de la red clínica C.A.N.D.Y."
        userName="Admin"
        userInitials="AD"
      />

      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Métricas de Usuarios (Tiempo Real)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Registrados" value={totalUsers} colorScheme="blue" />
          <StatCard title="Usuarios Activos" value={activeUsers} colorScheme="green" />
          <StatCard title="Administradores" value={adminUsers} colorScheme="purple" />
          <StatCard title="Sesiones Activas" value={activeSessions} colorScheme="pink" />
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 my-2" />

      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Rendimiento IA: C.A.N.D.Y. Network
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Análisis Procesados" value="123" colorScheme="indigo" />
          <StatCard title="Volumen Data Yield" value="4.2 TB" colorScheme="blue" />
          <StatCard title="Tasa Confianza IA" value="97.8%" colorScheme="green" />
          <StatCard title="Tiempo Prom. Análisis" value="1.2s" colorScheme="purple" />
        </div>
      </div>
    </div>
  );
}
