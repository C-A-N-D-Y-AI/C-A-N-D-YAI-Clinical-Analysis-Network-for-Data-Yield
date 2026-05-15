"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";

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
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesion", error);
    }
  };

  const navLinks = [
    {
      href: "/dashboard",
      label: "INICIO",
      icon: (
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a2 2 0 002 2h2a1 1 0 001-1v-4h2v4a1 1 0 001 1h2a2 2 0 002-2v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      ),
    },
    {
      href: "/dashboard/documentos",
      label: "DOCUMENTOS",
      icon: (
        <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8l-4-4H6zm5 1.5V9h4.5" />
      ),
    },
    {
      href: "/dashboard/actividad",
      label: "ACTIVIDAD",
      icon: (
        <path d="M3 10h3l2-5 4 10 2-5h3" />
      ),
    },
    {
      href: "/dashboard/recomendaciones",
      label: "AI",
      icon: (
        <path d="M10 2l2.5 5L18 8l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1L10 2z" />
      ),
    },
    {
      href: "/dashboard/perfil",
      label: "PERFIL",
      icon: (
        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
      ),
    },
    {
      href: "/dashboard/soporte",
      label: "SOPORTE",
      icon: (
        <path d="M18 10c0-4.418-3.582-8-8-8s-8 3.582-8 8a8 8 0 0014.32 4.906L18 18v-8z" />
      ),
    },
    ...(user?.role === "ADMIN"
      ? [
          {
            href: "/dashboard/users",
            label: "USUARIOS",
            icon: (
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            ),
          },
        ]
      : []),
    {
      href: "/dashboard/settings",
      label: "AJUSTES",
      icon: (
        <path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
      ),
    },
  ];

  return (
    <nav className="relative z-50 flex items-center justify-between bg-[#020617] px-8 py-4 backdrop-blur-xl border-none shadow-none outline-none">
      <div className="flex items-center gap-10 flex-1">

        {/* LOGO FUTURISTA */}
        <Link href="/dashboard" className="group flex items-center gap-4">

          <div className="relative flex h-[68px] w-[68px] items-center justify-center">

            {/* AURA */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-2xl scale-150 animate-corePulse" />

            {/* GLOW */}
            <div className="absolute h-8 w-8 rounded-full bg-cyan-300/30 blur-xl animate-energy" />

            {/* PARTICLES */}
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />

            <svg
              viewBox="0 0 200 200"
              className="relative z-10 h-full w-full overflow-visible"
            >
              <defs>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <radialGradient id="coreGradient">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#67e8f9" />
                  <stop offset="70%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </radialGradient>

                <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#67e8f9" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
                </linearGradient>

              </defs>

              {/* ORBITA EXTERNA */}
              <g className="animate-orbitSlow origin-center">
                <ellipse
                  cx="100"
                  cy="100"
                  rx="78"
                  ry="24"
                  fill="none"
                  stroke="url(#orbitGradient)"
                  strokeWidth="2"
                  transform="rotate(-18 100 100)"
                  filter="url(#glow)"
                />
              </g>

              {/* ORBITA INTERNA */}
              <g className="animate-orbitReverse origin-center">
                <ellipse
                  cx="100"
                  cy="100"
                  rx="58"
                  ry="14"
                  fill="none"
                  stroke="#67e8f9"
                  strokeWidth="1.5"
                  strokeDasharray="8 10"
                  opacity="0.7"
                  transform="rotate(28 100 100)"
                />
              </g>

              {/* ORBITA LIGHT */}
              <g className="animate-orbitFast origin-center">
                <ellipse
                  cx="100"
                  cy="100"
                  rx="88"
                  ry="8"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="1"
                  opacity="0.2"
                  transform="rotate(75 100 100)"
                />
              </g>

              {/* NUCLEO */}
              <g filter="url(#glow)">
                <circle
                  cx="100"
                  cy="100"
                  r="24"
                  fill="url(#coreGradient)"
                  className="animate-core"
                />

                <circle
                  cx="100"
                  cy="100"
                  r="10"
                  fill="#ffffff"
                  opacity="0.95"
                />
              </g>

              {/* NEURAL LINES */}
              <g opacity="0.9">

                <path
                  d="M100 58 L100 40"
                  stroke="#67e8f9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-neural"
                />

                <path
                  d="M142 100 L160 100"
                  stroke="#67e8f9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-neural delay-200"
                />

                <path
                  d="M100 142 L100 160"
                  stroke="#67e8f9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-neural delay-500"
                />

                <path
                  d="M58 100 L40 100"
                  stroke="#67e8f9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-neural delay-700"
                />

              </g>

              {/* NODES */}
              <circle cx="100" cy="40" r="3" fill="#ffffff" className="animate-node" />
              <circle cx="160" cy="100" r="3" fill="#ffffff" className="animate-node delay-200" />
              <circle cx="100" cy="160" r="3" fill="#ffffff" className="animate-node delay-500" />
              <circle cx="40" cy="100" r="3" fill="#ffffff" className="animate-node delay-700" />

            </svg>
          </div>

          {/* TEXTO */}
          <div className="relative flex flex-col">

            <span className="text-[24px] font-black tracking-[0.28em] text-white uppercase">
              C.A.N.D.Y
            </span>

            <div className="relative mt-2 h-[2px] overflow-hidden rounded-full bg-white/5">
              <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-shimmerX" />
            </div>

          </div>
        </Link>

        {/* NAV LINKS CENTRO */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] border transition-all duration-500 ${
                  isActive
                    ? "border-sky-500/40 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
                    : "border-white/5 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <svg
                  className={`h-6 w-6 transition-all duration-300 ${
                    isActive
                      ? "text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
                      : "text-slate-500 group-hover:text-sky-300"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 20 20"
                >
                  {link.icon}
                </svg>

                <span className="absolute -bottom-10 scale-0 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md transition-all group-hover:scale-100 border border-white/10">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 rounded-full bg-white/[0.03] pl-2 pr-2 py-1.5 border border-white/5">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-400/40 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
                <span className="text-sm font-bold text-white">
                  {user.name
                    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                    : user.email[0].toUpperCase()}
                </span>
              </div>

              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#020617] bg-emerald-400" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-tight">
                {user.name || user.email.split("@")[0]}
              </span>
            </div>
          </div>
        )}

        <div className="h-8 w-px bg-white/10 mx-1" />

        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/5 text-red-400 transition-all hover:bg-red-500 hover:text-white border border-red-500/10"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <style jsx>{`

        @keyframes orbitSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes orbitFast {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(720deg);
          }
        }

        @keyframes core {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.45);
          }
        }

        @keyframes corePulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1.2);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.55);
          }
        }

        @keyframes energy {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes neural {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }

        @keyframes node {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.8);
            opacity: 1;
          }
        }

        @keyframes shimmerX {
          0% {
            left: -50%;
          }
          100% {
            left: 150%;
          }
        }

        .animate-orbitSlow {
          animation: orbitSlow 12s linear infinite;
        }

        .animate-orbitReverse {
          animation: orbitReverse 8s linear infinite;
        }

        .animate-orbitFast {
          animation: orbitFast 20s linear infinite;
        }

        .animate-core {
          animation: core 3s ease-in-out infinite;
        }

        .animate-corePulse {
          animation: corePulse 4s ease-in-out infinite;
        }

        .animate-energy {
          animation: energy 2.5s ease-in-out infinite;
        }

        .animate-neural {
          animation: neural 2s ease-in-out infinite;
        }

        .animate-node {
          animation: node 2s ease-in-out infinite;
        }

        .animate-shimmerX {
          animation: shimmerX 3s linear infinite;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .particle {
          position: absolute;
          border-radius: 9999px;
          background: white;
          opacity: 0.9;
          z-index: 20;
        }

        .particle-1 {
          width: 4px;
          height: 4px;
          top: 10%;
          left: 50%;
          animation: orbitSlow 5s linear infinite;
        }

        .particle-2 {
          width: 3px;
          height: 3px;
          bottom: 20%;
          right: 10%;
          animation: orbitReverse 6s linear infinite;
        }

        .particle-3 {
          width: 5px;
          height: 5px;
          top: 50%;
          left: 0%;
          animation: orbitFast 8s linear infinite;
        }

        .particle-4 {
          width: 3px;
          height: 3px;
          top: 70%;
          right: 0%;
          animation: orbitSlow 7s linear infinite;
        }

      `}</style>
    </nav>
  );
}