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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 text-slate-900 selection:bg-blue-500/30">
      
      {/* Fondo decorativo (Idéntico al Login) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6">
        
        {/* Logo + header (Idéntico al Login) */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
            <span className="font-bold tracking-[0.45em] text-xs uppercase text-blue-900">C.A.N.D.Y</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Crear cuenta</h1>
          <p className="mt-2 text-xs text-slate-500 tracking-wide">
            Únete a la plataforma clínica C.A.N.D.Y
          </p>
        </div>

        {/* Card (Idéntico al Login) */}
        <form
          onSubmit={handleRegister}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-blue-900/5"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
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
            className="mt-7 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            {loading ? "Procesando registro..." : "Empezar ahora →"}
          </button>

          <p className="mt-7 text-center text-xs text-slate-500">
            ¿Ya eres miembro?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
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