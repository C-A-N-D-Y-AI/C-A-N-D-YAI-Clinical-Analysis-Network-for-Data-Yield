import React from "react";
import { AdminHeader } from "./AdminHeader";
import { MonthlyActivityChart } from "./MonthlyActivityChart";
import { prisma } from "@/infrastructure/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const users = await prisma.user.findMany({
    select: { createdAt: true },
  });

  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const months: { year: number; month: number; label: string; count: number }[] = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: monthNames[d.getMonth()], count: 0 });
  }

  users.forEach((u) => {
    const y = u.createdAt.getFullYear();
    const m = u.createdAt.getMonth();
    const match = months.find((x) => x.year === y && x.month === m);
    if (match) match.count++;
  });

  const chartData = months.map((m) => ({ label: m.label, value: m.count }));

  return (
    <div className="w-full flex flex-col gap-8">
      <AdminHeader
        title="Panel de Administración"
        description="Bienvenido al centro de control."
        userName="Admin"
        userInitials="AD"
      />
      <div className="w-full">
        <MonthlyActivityChart data={chartData} />
      </div>
    </div>
  );
}
