"use client";
import Link from "next/link";
 
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-blue-500/30">
 
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-5 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
          <span className="font-bold tracking-[0.45em] text-xs uppercase text-blue-900">C.A.N.D.Y</span>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
          <Link href="/login" className="text-slate-500 hover:text-blue-600 transition-colors px-3 py-1">Login</Link>
          <Link href="/register" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full text-white font-semibold">
            Register
          </Link>
        </div>
      </nav>
 
      {/* HERO */}
      <main className="relative text-center pt-52 pb-28 px-6 max-w-4xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
 
        <p className="text-blue-600 text-xs uppercase tracking-[0.3em] mb-5 font-medium">
          Plataforma Clínica Inteligente
        </p>
 
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
          Entiende tu salud
          <br />
          <span className="text-slate-500 italic font-light">como nunca antes</span>
        </h1>
 
        <p className="mt-6 text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
          C.A.N.D.Y convierte diagnósticos médicos en{" "}
          <span className="text-blue-600 font-semibold">visualizaciones 3D simples</span>{" "}
          para mejor comprensión.
        </p>
 
        <div className="mt-10 flex justify-center gap-3 flex-wrap">
          <Link href="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full font-semibold text-sm text-white">
            Explorar diagnóstico
          </Link>
          <Link href="/login" className="px-8 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all rounded-full text-sm text-slate-600">
            Acceder
          </Link>
        </div>
      </main>
 
      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-4 pb-24">
        {[
          { title: "Visualización 3D", desc: "Explora información médica de forma clara y tridimensional." },
          { title: "Interpretación médica", desc: "Convierte datos complejos en información comprensible." },
          { title: "Análisis clínico", desc: "Seguimiento estructurado y preciso del paciente." },
        ].map((item, i) => (
          <div key={i} className="p-7 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-5" />
            <h3 className="font-semibold text-sm text-slate-900 mb-2 tracking-wide">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
 
      {/* CTA */}
      <section className="text-center py-24 px-6 border-t border-slate-100 bg-slate-50/30">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
          Comprende tu salud{" "}
          <span className="text-blue-600 italic font-light">visualmente</span>
        </h2>
        <p className="text-slate-500 text-sm mb-8">Plataforma médica moderna basada en datos.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full text-sm font-semibold text-white">
            Crear cuenta
          </Link>
          <Link href="/login" className="px-8 py-3 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all rounded-full text-sm text-slate-600">
            Login
          </Link>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400 tracking-widest bg-white">
        © 2026 C.A.N.D.Y · Plataforma Clínica Inteligente
      </footer>
    </div>
  );
}
