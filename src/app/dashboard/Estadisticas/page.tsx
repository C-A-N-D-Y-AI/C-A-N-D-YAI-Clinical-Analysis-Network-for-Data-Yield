"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalDocuments: number;
  storageUsedGB: string;
  storageLimitGB: number;
  storagePercent: number;
}

interface RecentDocument {
  id: string;
  name: string;
  size: number;
  createdAt: string;
}

interface DashboardData {
  user: { name?: string | null; email: string };
  stats: DashboardStats | null;
  documents: RecentDocument[];
}

export default function UserDashboardPage() {
  const [user, setUser] = useState<{ name?: string | null; email: string } | null>(null);
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDashboardData = useCallback(async (): Promise<DashboardData | null> => {
    const authRes = await fetch("/api/auth/me", { cache: "no-store" });
    if (!authRes.ok) {
      router.push("/login");
      return null;
    }

    const authData = await authRes.json();
    let stats: DashboardStats | null = null;
    let documents: RecentDocument[] = [];

    const statsRes = await fetch("/api/stats", { cache: "no-store" });
    if (statsRes.ok) {
      const statsJson = await statsRes.json();
      if (statsJson.success) stats = statsJson.stats;
    }

    const docsRes = await fetch("/api/documents/recent", { cache: "no-store" });
    const contentType = docsRes.headers.get("content-type");

    if (docsRes.ok && contentType?.includes("application/json")) {
      const docsJson = await docsRes.json();
      if (docsJson.success) documents = docsJson.documents || [];
    }

    return { user: authData.user, stats, documents };
  }, [router]);

  function applyDashboardData(data: DashboardData | null) {
    if (!data) return;
    setUser(data.user);
    setStatsData(data.stats);
    setRecentDocs(data.documents);
  }

  // Función para eliminar el documento y actualizar la vista
  async function handleDelete(docId: string) {
    if (!confirm("¿Seguro que quieres borrar este recuerdo?")) return;

    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        // Al recargar los datos, los GB usados y el % libre se actualizan solos
        applyDashboardData(await fetchDashboardData());
      } else {
        alert("No se pudo eliminar el archivo del servidor.");
      }
    } catch {
      alert("Error al eliminar el archivo");
    }
  }

  useEffect(() => {
    let mounted = true;

    fetchDashboardData()
      .then((data) => {
        if (!mounted) return;
        applyDashboardData(data);
      })
      .catch((error: unknown) => {
        console.error("Fallo crítico:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [fetchDashboardData]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-pulse text-blue-600 font-medium tracking-widest text-sm italic">
          Cargando tus estadísticas...
        </div>
      </div>
    );

  // Cálculos de almacenamiento
  const storageUsed = Number(statsData?.storageUsedGB ?? 0);
  const totalDocuments = statsData?.totalDocuments ?? 0;
  const storagePercent = statsData?.storagePercent ?? 100;
  const usedPercent = (storageUsed / 10) * 100;

  const statusColor = storagePercent > 30 ? "text-green-400" : storagePercent > 10 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-4 md:p-8 overflow-hidden relative">
      
      {/* Luces de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* BIENVENIDA */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-medium uppercase tracking-wider">
            Sistema C.A.N.D.Y preparado
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-6 text-slate-900">
            Estadística <br />
            <span className="text-blue-600 italic">Personal</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed mt-6 border-l-4 border-blue-500/30 pl-6">
            ¡Hola, <span className="text-slate-900 font-semibold">{user?.name ?? "Cariño"}</span>! 
            Hoy tienes el <span className={statusColor.replace('sky', 'blue').replace('green', 'emerald')}>{storagePercent}%</span> de tu espacio libre para guardar más cosas.
          </p>
        </div>

        {/* RESUMEN DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { t: "MIS PAPELES", v: totalDocuments, s: "Documentos guardados" },
            { t: "ESPACIO OCUPADO", v: `${storageUsed} GB`, s: "Lo que ya usamos" },
            { t: "ESPACIO LIBRE", v: `${storagePercent}%`, s: "Lo que nos queda" },
            { t: "CAPACIDAD TOTAL", v: "10 GB", s: "Tamaño de tu baúl" }
          ].map((stat) => (
            <div key={stat.t} className="rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:bg-slate-50 shadow-sm">
              <p className="text-[10px] tracking-[0.2em] font-black text-slate-400 uppercase">{stat.t}</p>
              <h2 className="text-4xl font-bold mt-2 text-slate-900">{stat.v}</h2>
              <p className="text-slate-500 text-xs mt-2">{stat.s}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-16">
          
          <div className="rounded-[3rem] border border-slate-100 bg-slate-50/30 p-10 flex flex-col items-center shadow-sm">
            <h2 className="text-2xl font-semibold mb-2 text-slate-900">Estado del Baúl</h2>
            <p className="text-slate-500 text-sm mb-10 text-center text-balance">Así se ve tu espacio de almacenamiento hoy.</p>

            <div className="relative w-64 h-64 flex items-center justify-center bg-white rounded-full shadow-inner">
              <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="text-center z-10">
                <span className={`text-6xl font-black ${statusColor.replace('sky', 'blue').replace('green', 'emerald')}`}>{storagePercent}%</span>
                <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-bold">Libre</p>
              </div>
            </div>

            <div className="w-full mt-12">
              <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-3 tracking-widest">
                <span>OCUPADO: {usedPercent.toFixed(0)}%</span>
                <span>META: 10 GB</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 shadow-lg shadow-blue-500/20"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ÚLTIMAS COSAS GUARDADAS CON BOTÓN DE ELIMINAR */}
          <div className="rounded-[3rem] border border-slate-100 bg-slate-50/30 p-10 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2 text-slate-900">Lo último que guardaste</h2>
            <p className="text-slate-500 text-sm mb-8">Aquí están tus archivos más recientes.</p>
            
            <div className="space-y-4">
              {recentDocs.length > 0 ? (
                recentDocs.map((doc) => (
                  <div key={doc.id} className="group flex items-center gap-5 rounded-3xl bg-white p-5 hover:bg-slate-50 transition-all border border-slate-200 hover:border-blue-500/20 shadow-sm">
                    <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-slate-900 truncate text-sm">{doc.name}</p>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                        Guardado el {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* BOTÓN DE BASURA */}
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-200 transition-all"
                      title="Eliminar este archivo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>

                    <div className="text-right ml-2">
                      <p className="text-xs font-bold text-blue-600">{(doc.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-50 italic text-sm text-slate-500">
                  Aún no hemos guardado nada nuevo por aquí...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
