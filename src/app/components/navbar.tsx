"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  user?: {
    email: string;
    name?: string | null;
    role: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesion", error);
    }
  };

  const roleBadgeVariant =
    user?.role === "ADMIN"
      ? "danger"
      : user?.role === "user"
      ? "warning"
      : "neutral";

  const navLinks = [
    { 
      href: "/dashboard", 
      label: "INICIO", 
      icon: <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a2 2 0 002 2h2a1 1 0 001-1v-4h2v4a1 1 0 001 1h2a2 2 0 002-2v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /> 
    },
    { 
      href: "/dashboard/AI", 
      label: "C.A.N.D.Y", 
      icon: <path d="M11 15a3 3 0 100-6 3 3 0 000 6zM15 5a2 2 0 11-4 0 2 2 0 014 0zM7 5a2 2 0 11-4 0 2 2 0 014 0zM5 13a2 2 0 11-4 0 2 2 0 014 0zM19 13a2 2 0 11-4 0 2 2 0 014 0zM15 19a2 2 0 11-4 0 2 2 0 014 0z" /> 
    },
    { 
      href: "/dashboard/Estadisticas", 
      label: "ESTADISTICAS", 
      icon: <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11.414V5h-2v1.586L7.586 8H6v2h1.586L9 11.414V13h2v-1.586L12.414 10H14V8h-1.586L11 6.586z" clipRule="evenodd" /> 
    },
    ...(user?.role === "ADMIN" ? [{ 
      href: "/dashboard/users", 
      label: "USUARIOS", 
      icon: <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /> 
    }] : []),
    { 
      href: "/dashboard/settings", 
      label: "AJUSTES", 
      icon: <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /> 
    },
  ];

  return (
    <nav className="relative z-50 flex items-center justify-between bg-white/90 px-8 py-4 border-b border-slate-200 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-10">
        {/* LOGO IZQUIERDA - MINI 3D CROSS */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/20 transition-all group-hover:scale-110 group-hover:shadow-sky-500/40 relative overflow-hidden">
             
             {/* ESCENA 3D MINIATURIZADA */}
             <div className="nav-scene">
               <div className="nav-cross-3d animate-nav-rotate3d">
                 {/* Cuerpo Vertical */}
                 <div className="n-face v-front"></div>
                 <div className="n-face v-back"></div>
                 <div className="n-face v-left"></div>
                 <div className="n-face v-right"></div>
                 <div className="n-face v-top"></div>
                 <div className="n-face v-bottom"></div>
                 {/* Cuerpo Horizontal */}
                 <div className="n-face h-front"></div>
                 <div className="n-face h-back"></div>
                 <div className="n-face h-left"></div>
                 <div className="n-face h-right"></div>
                 <div className="n-face h-top"></div>
                 <div className="n-face h-bottom"></div>
               </div>
             </div>

             {/* Brillo de barrido */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">C.A.N.D.Y</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] border transition-all duration-500 ${
                  isActive
                    ? "border-sky-200 bg-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <svg
                  className={`h-6 w-6 transition-all duration-300 ${
                    isActive ? "text-sky-600 drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]" : "text-slate-500 group-hover:text-slate-900"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {link.icon}
                </svg>

                <span className="absolute -bottom-10 scale-0 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md transition-all group-hover:scale-100 border border-white/10">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 rounded-full bg-slate-50 pl-4 pr-2 py-1.5 border border-slate-200">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-900 tracking-tight">{user.name || user.email.split("@")[0]}</span>
            </div>
            <div className="scale-90">
                <Badge variant={roleBadgeVariant}>{user.role}</Badge>
            </div>
          </div>
        )}

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 transition-all hover:bg-rose-600 hover:text-white border border-rose-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* ESTILOS MINI 3D */}
      <style jsx>{`
        .nav-scene {
          width: 30px;
          height: 30px;
          perspective: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
        }
        .nav-cross-3d {
          width: 8px;
          height: 8px;
          position: relative;
          transform-style: preserve-3d;
        }
        @keyframes nav-rotate3d {
          0% { transform: rotateY(0deg) rotateX(45deg) translateY(0px); }
          50% { transform: rotateY(180deg) rotateX(-45deg) translateY(-3px); }
          100% { transform: rotateY(360deg) rotateX(45deg) translateY(0px); }
        }
        .animate-nav-rotate3d {
          animation: nav-rotate3d 5s ease-in-out infinite;
        }
        .n-face {
          position: absolute;
          background: white;
          border: 0.5px solid rgba(14, 165, 233, 0.2);
        }
        /* Vertical Mini */
        .v-front, .v-back { width: 8px; height: 24px; left: 0; top: -8px; }
        .v-left, .v-right { width: 8px; height: 24px; left: 0; top: -8px; }
        .v-top, .v-bottom { width: 8px; height: 8px; left: 0; }
        .v-front  { transform: translateZ(4px); }
        .v-back   { transform: rotateY(180deg) translateZ(4px); }
        .v-left   { transform: rotateY(-90deg) translateZ(4px); }
        .n-face.v-right  { transform: rotateY(90deg) translateZ(4px); }
        .v-top    { transform: rotateX(90deg) translateZ(12px); }
        .v-bottom { transform: rotateX(-90deg) translateZ(12px); }
        /* Horizontal Mini */
        .h-front, .h-back { width: 24px; height: 8px; left: -8px; top: 0; }
        .h-left, .h-right { width: 8px; height: 8px; left: -8px; top: 0; }
        .h-top, .h-bottom { width: 24px; height: 8px; left: -8px; top: 0; }
        .h-front  { transform: translateZ(4px); }
        .h-back   { transform: rotateY(180deg) translateZ(4px); }
        .h-left   { transform: rotateY(-90deg) translateZ(4px); }
        .n-face.h-right  { transform: rotateY(90deg) translateZ(20px); }
        .h-top    { transform: rotateX(90deg) translateZ(4px); }
        .h-bottom { transform: rotateX(-90deg) translateZ(4px); }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </nav>
  );
}
