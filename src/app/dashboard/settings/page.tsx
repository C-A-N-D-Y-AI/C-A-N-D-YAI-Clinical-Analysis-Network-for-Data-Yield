"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Cargar datos actuales del usuario al entrar
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.user.name || "", email: data.user.email || "" });
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Función para actualizar perfil (Nombre y Email)
  async function handleUpdateProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        // Notifica al Navbar para que cambie el nombre arriba sin refrescar
        window.dispatchEvent(new Event("userUpdated"));

        alert("✅ Núcleo actualizado correctamente.");
        
        // Redirige a la tabla de usuarios
        router.push("/dashboard/users"); 
      } else {
        const errorData = await res.json();
        // Si sale "No token", es necesario re-loguear
        alert(`Error: ${errorData.error || "No se pudo actualizar"}`);
      }
    } catch (err) {
      console.error("Fallo de red:", err);
      alert("Fallo de conexión con el núcleo.");
    } finally {
      setSaving(false);
    }
  }

  // FUNCIÓN DE EMERGENCIA: Borra la cuenta y documentos
  async function handleEmergencyDelete() {
    const confirm1 = confirm("¿ESTÁS SEGURO? Esta acción eliminará tu cuenta y TODOS tus documentos de C.A.N.D.Y de forma permanente.");
    if (!confirm1) return;

    const confirm2 = prompt(`Para confirmar, escribe tu correo electrónico (${user.email}):`);
    if (confirm2 !== user.email) {
      alert("El correo no coincide. Abortando protocolo de emergencia.");
      return;
    }

    try {
      // Ruta actualizada según tu árbol de archivos: src/app/api/users/delete-everything/route.ts
      const res = await fetch("/api/users/delete-everything", { method: "DELETE" });
      if (res.ok) {
        alert("💥 Instancia terminada. Todos los datos han sido borrados.");
        window.location.href = "/register"; 
      } else {
        alert("Fallo en la autorización para borrar los datos. Intenta cerrar sesión y volver a entrar.");
      }
    } catch {
      alert("Fallo crítico en el protocolo de borrado.");
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="animate-pulse text-blue-600 font-medium tracking-widest text-sm italic">
        Accediendo al núcleo...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 md:p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Panel de Control Central
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Ajustes del <span className="text-blue-600 italic">Núcleo</span>
          </h1>
        </header>

        <div className="grid gap-6">
          {/* IDENTIDAD */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Identidad del Usuario
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Nombre del Sujeto</label>
                <input 
                  type="text" 
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Enlace de Comunicación</label>
                <input 
                  type="email" 
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* PREFERENCIAS DEL SISTEMA */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
              Configuración de Interfaz
            </h2>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-900">Modo de Alta Disponibilidad</p>
                <p className="text-xs text-slate-500">Optimiza el rendimiento para conexiones lentas.</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-blue-600 relative cursor-pointer">
                <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </section>

          {/* PROTOCOLO DE EMERGENCIA */}
          <section className="rounded-[2rem] border border-red-200 bg-red-50 p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 text-red-600">Protocolo de Emergencia</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-xs text-red-600/80 max-w-md leading-relaxed">
                Al activar el borrado del núcleo, se eliminarán permanentemente tus archivos, estadísticas y cuenta de la base de datos. Esta acción no se puede deshacer.
              </p>
              <button 
                onClick={handleEmergencyDelete}
                className="px-6 py-3 rounded-2xl bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest shadow-sm"
              >
                Terminar Instancia
              </button>
            </div>
          </section>
        </div>

        <div className="mt-12 flex justify-end gap-4">
          <button 
            onClick={handleUpdateProfile} 
            disabled={saving} 
            className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Procesando..." : "Actualizar Núcleo"}
          </button>
        </div>
      </div>
    </div>
  );
}
