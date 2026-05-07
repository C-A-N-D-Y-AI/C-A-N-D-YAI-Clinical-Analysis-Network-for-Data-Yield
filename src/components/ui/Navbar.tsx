"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Ocultar este Navbar en todas las rutas del dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav className="relative z-50 flex items-center justify-between bg-[#020617] px-8 py-4 backdrop-blur-xl border-none shadow-none outline-none">
      
      <div className="flex items-center gap-10">
        {/* LOGO IZQUIERDA - MINI 3D CROSS */}
        <Link href="/" className="flex items-center gap-3 group">
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
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          className="text-sm font-bold text-slate-300 hover:text-sky-400 transition-colors"
        >
          Inicio
        </Link>
        <Link 
          href="/login" 
          className="px-5 py-2 rounded-full border border-white/10 text-white hover:border-sky-500/50 hover:bg-sky-500/10 transition-all text-sm font-bold"
        >
          Acceder
        </Link>
        <Link 
          href="/register" 
          className="px-5 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all text-sm font-bold"
        >
          Register
        </Link>
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