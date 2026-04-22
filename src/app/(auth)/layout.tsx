import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register y login de mi app",
    description: "quiero que encuentren esto",
};

export default function authLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
                <div className="text-center mb-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                        <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Seguridad AI</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        RIWI <span className="text-blue-500">.IA</span>
                    </h1>
                    <h1>Hola</h1>
                </div>
                {children}
                <p className="text-center mt-8 text-sm text-gray-500 font-light">
                    &copy; 2026 RIWI .IA - Potenciado por Agentes
                </p>
            </div>
        </div>
    );
}