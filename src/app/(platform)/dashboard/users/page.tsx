"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboardPage() {
  const [user, setUser] = useState<{ name?: string | null; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const authRes = await fetch("/api/auth/me", { cache: "no-store" });
        const authData = await authRes.json();
        if (!authRes.ok || !authData.success) {
          router.push("/login");
          return;
        }
        setUser(authData.user);
      } catch (error) {
        console.error("Fallo crítico:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617]">
      <div className="animate-pulse text-[#0ea5e9] font-black tracking-widest text-xs uppercase">Sincronizando con C.A.N.D.Y...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 md:p-8 overflow-hidden relative flex items-center">
      
      {/* ── EFECTOS DE FONDO ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ── COLUMNA IZQUIERDA: BIENVENIDA ── */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/5 text-sky-400 text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              C.A.N.D.Y Core Online
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] mb-4">
              Welcome to <br />
              <span className="text-[#0ea5e9] italic drop-shadow-[0_0_30px_rgba(14,165,233,0.4)]">C.A.N.D.Y.</span>
            </h1>
            
            <p className="text-slate-400 text-xl max-w-lg leading-relaxed border-l-2 border-sky-500/20 pl-6">
              Hola, <span className="text-white font-semibold">{user?.name || 'Usuario'}</span>. 
              El núcleo médico ha sido inicializado. La inteligencia artificial está analizando tus parámetros biométricos en tiempo real.
            </p>
          </div>

          {/* ── COLUMNA DERECHA: IA CON CRUZ 3D ── */}
          <div className="flex justify-center items-center relative">
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center">
              
              {/* Anillos de Datos Externos */}
              <div className="absolute inset-0 border border-sky-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-10 border border-dashed border-sky-400/30 rounded-full animate-[spin_20s_linear_infinite_reverse]" />

              {/* Orbe Central / Cámara de Contención */}
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-sky-500/5 border border-sky-500/20 shadow-[0_0_100px_rgba(14,165,233,0.2)] backdrop-blur-sm flex items-center justify-center overflow-hidden">
                
                {/* LUZ INTERNA PULSANTE */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-600/10 to-transparent animate-pulse" />

                {/* ── CRUZ 3D FLOTANTE ── */}
                <div className="scene">
                  <div className="cross-3d animate-rotate3d">
                    {/* Cuerpo Vertical de la Cruz */}
                    <div className="face v-front"></div>
                    <div className="face v-back"></div>
                    <div className="face v-left"></div>
                    <div className="face v-right"></div>
                    <div className="face v-top"></div>
                    <div className="face v-bottom"></div>

                    {/* Cuerpo Horizontal de la Cruz */}
                    <div className="face h-front"></div>
                    <div className="face h-back"></div>
                    <div className="face h-left"></div>
                    <div className="face h-right"></div>
                    <div className="face h-top"></div>
                    <div className="face h-bottom"></div>
                  </div>
                </div>

                {/* Rayo de Escaneo */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/30 to-transparent h-12 w-full animate-scan" />
              </div>

              {/* Partículas Orbitando */}
              <div className="absolute w-full h-full animate-[spin_8s_linear_infinite]">
                <div className="w-2 h-2 bg-sky-400 rounded-full blur-[1px] absolute top-0 left-1/2 shadow-[0_0_15px_#0ea5e9]" />
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* ── ESTILOS CSS 3D ── */}
      <style jsx>{`
        .scene {
          width: 80px;
          height: 80px;
          perspective: 800px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 20px rgba(14,165,233,0.8));
        }

        .cross-3d {
          width: 20px;
          height: 20px;
          position: relative;
          transform-style: preserve-3d;
        }

        @keyframes rotate3d {
          0% { transform: rotateY(0deg) rotateX(45deg) translateY(0px); }
          50% { transform: rotateY(180deg) rotateX(-45deg) translateY(-20px); }
          100% { transform: rotateY(360deg) rotateX(45deg) translateY(0px); }
        }

        .animate-rotate3d {
          animation: rotate3d 7s ease-in-out infinite;
        }

        .face {
          position: absolute;
          background: #0ea5e9;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }

        /* TAMAÑOS: Cruz de 60px de largo, 20px de grosor */
        /* Vertical */
        .v-front, .v-back { width: 20px; height: 60px; left: 0; top: -20px; }
        .v-left, .v-right { width: 20px; height: 60px; left: 0; top: -20px; }
        .v-top, .v-bottom { width: 20px; height: 20px; left: 0; }

        .v-front  { transform: translateZ(10px); }
        .v-back   { transform: rotateY(180deg) translateZ(10px); }
        .v-left   { transform: rotateY(-90deg) translateZ(10px); }
        .v-right  { transform: rotateY(90deg) translateZ(10px); }
        .v-top    { transform: rotateX(90deg) translateZ(30px); }
        .v-bottom { transform: rotateX(-90deg) translateZ(30px); }

        /* Horizontal */
        .h-front, .h-back { width: 60px; height: 20px; left: -20px; top: 0; }
        .h-left, .h-right { width: 20px; height: 20px; left: -20px; top: 0; }
        .h-top, .h-bottom { width: 60px; height: 20px; left: -20px; top: 0; }

        .h-front  { transform: translateZ(10px); }
        .h-back   { transform: rotateY(180deg) translateZ(10px); }
        .h-left   { transform: rotateY(-90deg) translateZ(10px); }
        .h-right  { transform: rotateY(90deg) translateZ(50px); }
        .h-top    { transform: rotateX(90deg) translateZ(10px); }
        .h-bottom { transform: rotateX(-90deg) translateZ(10px); }

        @keyframes scan {
          0% { transform: translateY(-150%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}