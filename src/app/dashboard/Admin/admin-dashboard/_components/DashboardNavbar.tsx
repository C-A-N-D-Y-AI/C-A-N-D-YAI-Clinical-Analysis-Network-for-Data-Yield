"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JWTPayload } from "@/lib/jwt";

interface DashboardNavbarProps {
  user: JWTPayload;
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const navLinks = [
    {
      href: "/dashboard/Admin",
      label: "INICIO",
      icon: <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a2 2 0 002 2h2a1 1 0 001-1v-4h2v4a1 1 0 001 1h2a2 2 0 002-2v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />,
    },
    {
      href: "/dashboard/Admin/estadisticas",
      label: "ESTADÍSTICAS",
      icon: <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />,
    },
    ...(user.role === "ADMIN"
      ? [{
          href: "/dashboard/Admin/users",
          label: "USUARIOS",
          icon: <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />,
        }]
      : []),
  ];

  return (
    <nav className="relative z-50 flex items-center justify-between bg-white px-8 py-4 border-b border-slate-200">
      <div className="flex items-center gap-10">
        <Link href="/dashboard/Admin" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-500/20 transition-all group-hover:scale-110">
            <span className="text-white font-black text-xs">CA</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">C.A.N.D.Y</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard/Admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] border transition-all duration-500 ${
                  isActive
                    ? "border-blue-500/40 bg-blue-50 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                    : "border-slate-100 bg-slate-50 hover:border-slate-200"
                }`}
              >
                <svg
                  className={`h-6 w-6 transition-all duration-300 ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {link.icon}
                </svg>
                <span className="absolute -bottom-10 scale-0 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white transition-all group-hover:scale-100 border border-slate-800">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/5 text-red-400 transition-all hover:bg-red-500 hover:text-white border border-red-500/10"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </nav>
  );
}
