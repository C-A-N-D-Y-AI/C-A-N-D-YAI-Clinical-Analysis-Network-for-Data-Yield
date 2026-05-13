"use client";
 
import { useState } from "react";
import Link from "next/link";
 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
 
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
 
      if (res.ok && data.success) {
        window.location.href = "/dashboard";
        return;
      }
 
      setError(data.error || "Credenciales inválidas.");
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 text-slate-900 selection:bg-blue-500/30">
 
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>
 
      <div className="relative z-10 w-full max-w-sm px-6">
 
        {/* Logo + header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
            <span className="font-bold tracking-[0.45em] text-xs uppercase text-blue-900">C.A.N.D.Y</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido</h1>
          <p className="mt-2 text-xs text-slate-500 tracking-wide">
            Portal de acceso para especialistas
          </p>
        </div>
 
        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-blue-900/5"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="doctor@clinica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
 
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contraseña
                </label>
                <Link href="#" className="text-[10px] text-blue-600 hover:text-blue-700 transition-colors">
                  ¿Olvidó su clave?
                </Link>
              </div>
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
            {loading ? "Autenticando..." : "Ingresar al sistema →"}
          </button>
 
          <p className="mt-7 text-center text-xs text-slate-500">
            ¿No tienes acceso todavía?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Solicitar cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
