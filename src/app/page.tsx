export default function Home() {
  return (
    <>
      <main className="min-h-[calc(100vh-73px)] flex items-center justify-center p-8 bg-[#050A18]">
        <div className="w-full max-w-4xl rounded-2xl bg-[#0D1525] border border-[#1A263D] shadow-2xl shadow-black/50 p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFFFFF] mb-4">Bienvenido a <span className="text-[#0091DA]">CANDY</span></h1>
              <p className="text-lg text-[#A0AEC0] mb-6">Entiende tu salud <span className="italic text-[#8E9AAF]">como nunca antes</span>. La plataforma que une datos clínicos y análisis con experiencia humana cálida.</p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="/register" className="px-6 py-3 bg-[#0091DA] hover:bg-[#007AB8] text-[#FFFFFF] rounded-full font-semibold shadow-lg shadow-[#0091DA]/20 transform hover:scale-[1.02] transition-all">REGISTER</a>
                <a href="/login" className="px-6 py-3 bg-transparent border border-[#1A263D] text-[#FFFFFF] rounded-full font-semibold hover:border-[#537FE7] hover:bg-[#1A263D]/50 transition-all">Acceder</a>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full h-52 md:h-64 rounded-xl bg-[#050A18] shadow-inner border border-[#1A263D] flex items-center justify-center text-[#A0AEC0]/70"> 
                <div className="text-center">
                  <p className="text-sm text-[#A0AEC0]/60">Visual placeholder</p>
                  <h3 className="mt-2 text-xl font-bold text-[#FFFFFF]">CANDY — Clinical Analysis Network</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
