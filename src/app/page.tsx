"use client";
import Link from "next/link";
 
export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-sky-500/30">
 
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-5 backdrop-blur-md bg-[#020617]/80 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
          <span className="font-bold tracking-[0.45em] text-xs uppercase text-sky-100">C.A.N.D.Y</span>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
          <Link href="/login" className="text-slate-400 hover:text-white transition-colors px-3 py-1">Login</Link>
          <Link href="/register" className="px-5 py-2 bg-sky-600 hover:bg-sky-500 transition-colors rounded-full text-white font-semibold">
            Register
          </Link>
        </div>
      </nav>
 
      {/* HERO */}
      <main className="relative text-center pt-52 pb-28 px-6 max-w-4xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
 
        <p className="text-sky-500 text-xs uppercase tracking-[0.3em] mb-5 font-medium">
          Plataforma Clínica Inteligente
        </p>
 
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
          Entiende tu salud
          <br />
          <span className="text-slate-500 italic font-light">como nunca antes</span>
        </h1>
 
        <p className="mt-6 text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          C.A.N.D.Y convierte diagnósticos médicos en{" "}
          <span className="text-sky-400">visualizaciones 3D simples</span>{" "}
          para mejor comprensión.
        </p>
 
        <div className="mt-10 flex justify-center gap-3 flex-wrap">
          <Link href="/register" className="px-8 py-3 bg-sky-600 hover:bg-sky-500 transition-colors rounded-full font-semibold text-sm">
            Explorar diagnóstico
          </Link>
          <Link href="/login" className="px-8 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all rounded-full text-sm text-slate-300">
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
          <div key={i} className="p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-sky-500/5 hover:border-sky-500/20 transition-all duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mb-5" />
            <h3 className="font-semibold text-sm text-white mb-2 tracking-wide">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>
 
      {/* CTA */}
      <section className="text-center py-24 px-6 border-t border-white/5">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Comprende tu salud{" "}
          <span className="text-slate-500 italic font-light">visualmente</span>
        </h2>
        <p className="text-slate-500 text-sm mb-8">Plataforma médica moderna basada en datos.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/register" className="px-8 py-3 bg-sky-600 hover:bg-sky-500 transition-colors rounded-full text-sm font-semibold">
            Crear cuenta
          </Link>
          <Link href="/login" className="px-8 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all rounded-full text-sm text-slate-300">
            Login
          </Link>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600 tracking-widest">
        © 2026 C.A.N.D.Y · Plataforma Clínica Inteligente
      </footer>
    </div>
  );
}
