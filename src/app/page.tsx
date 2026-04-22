export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black text-white">
        <div className="text-center max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"> Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">RIWI .IA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 font-light leading-relaxed"> La plataforma definitiva para gestionar tus clases y proyectos con el poder de la inteligencia artificial.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/register" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105"> Empezar ahora
            </a>
            <a href="/login" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all"> Iniciar sesión
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
