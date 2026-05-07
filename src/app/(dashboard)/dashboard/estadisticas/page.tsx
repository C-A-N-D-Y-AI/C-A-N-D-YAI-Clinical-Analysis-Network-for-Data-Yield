import React from 'react';
import { AdminHeader } from '@/components/dashboard/AdminHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function EstadisticasPage() {
  // Fix #9: Promise.all para paralelizar las 4 queries en lugar de ejecutarlas secuencialmente
  const [totalUsers, activeUsers, adminUsers, activeSessions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
  ]);

  // Métricas de IA (placeholders hasta conectar el módulo real)
  const aiAnalysesProcessed = "123";
  const dataYieldVolume = "4.2 TB";
  const aiConfidenceRate = "97.8%";
  const avgResponseTime = "1.2s";

  return (
    <div className="w-full flex flex-col gap-8">
      <AdminHeader
        title="Estadísticas del Sistema"
        description="Métricas y KPIs del funcionamiento de la red clínica C.A.N.D.Y."
        userName="Admin"
        userInitials="AD"
      />

      {/* Sección 1: Datos Reales del Sistema */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      <div className="h-px w-full bg-white/5 my-2" />

      {/* Sección 2: Rendimiento IA (Mocks) */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Rendimiento IA: C.A.N.D.Y. Network
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Análisis Procesados" value={aiAnalysesProcessed} colorScheme="indigo" />
          <StatCard title="Volumen Data Yield" value={dataYieldVolume} colorScheme="blue" />
          <StatCard title="Tasa Confianza IA" value={aiConfidenceRate} colorScheme="green" />
          <StatCard title="Tiempo Prom. Análisis" value={avgResponseTime} colorScheme="purple" />
        </div>
      </div>
    </div>
  );
}
