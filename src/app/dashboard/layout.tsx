"use client";

import Navbar from "@/app/components/navbar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; name?: string | null; role: string } | null>(null);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/dashboard/Admin");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch {
        // silently fail
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {!isAdminRoute && <Navbar user={user ?? undefined} />}
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
}
