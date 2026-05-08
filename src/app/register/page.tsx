"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setError(data.error || "Error al registrar");
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] text-slate-200 selection:bg-sky-500/30">
      
      {/* Fondo decorativo (Idéntico al Login) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-sky-600/10 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6">
        
        {/* Logo + header (Idéntico al Login) */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            <span className="font-bold tracking-[0.45em] text-xs uppercase text-sky-100">C.A.N.D.Y</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">Crear cuenta</h1>
          <p className="mt-2 text-xs text-slate-500 tracking-wide">
            Únete a la plataforma clínica C.A.N.D.Y
          </p>
        </div>

        {/* Card (Idéntico al Login) */}
        <form
          onSubmit={handleRegister}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@clinica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-sky-600 hover:bg-sky-500 py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-50"
          >
            {loading ? "Procesando registro..." : "Empezar ahora →"}
          </button>

          <p className="mt-7 text-center text-xs text-slate-500">
            ¿Ya eres miembro?{" "}
            <Link href="/login" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </form>

        <p className="mt-10 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
          C.A.N.D.Y v2.0 — Sistema de Gestión Médica
        </p>
      </div>
    </div>
  );
}