export default function Home() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center p-8 bg-[#FAF8F5]">
        <div className="w-full max-w-4xl rounded-2xl bg-[#F3ECE3] border border-[#DCAE8A]/30 shadow-md shadow-[#152A47]/6 p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#152A47] mb-4">Bienvenido a <span className="text-[#00B4D8]">CANDY</span></h1>
              <p className="text-lg text-[#152A47]/80 mb-6">La plataforma que une datos clínicos y análisis con experiencia humana cálida. Potenciado por Agentes.</p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="/register" className="px-6 py-3 bg-[#E07A5F] hover:bg-[#d66a54] text-white rounded-full font-semibold shadow-md shadow-[#E07A5F]/20 transform hover:scale-[1.02] transition-all">Empezar ahora</a>
                <a href="/login" className="px-6 py-3 bg-transparent border border-[#00B4D8] text-[#00B4D8] rounded-full font-semibold hover:bg-[#00B4D8]/10 transition-all">Iniciar sesión</a>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full h-52 md:h-64 rounded-xl bg-white shadow-inner border border-[#EAEAEA] flex items-center justify-center text-[#152A47]/70"> 
                <div>
                  <p className="text-sm text-[#152A47]/60">Visual placeholder</p>
                  <h3 className="mt-2 text-xl font-bold text-[#152A47]">CANDY — Clinical Analysis Network</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
