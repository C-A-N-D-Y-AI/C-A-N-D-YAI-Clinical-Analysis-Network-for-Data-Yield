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
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050A18] overflow-hidden relative">
            <div className="absolute top-8 left-8">
                <div className="inline-block px-3 py-1 rounded-full bg-[#0091DA]/10 border border-[#0091DA]/20">
                    <span className="text-xs font-bold text-[#0091DA] tracking-widest uppercase">Seguridad AI</span>
                </div>
            </div>

            <div className="max-w-md w-full bg-[#0D1525] border border-[#1A263D] rounded-3xl p-8 shadow-2xl shadow-black/50">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tighter">
                        CANDY <span className="text-[#0091DA]">.</span>
                    </h1>
                    <p className="mt-2 text-sm text-[#A0AEC0]">Accede a tu cuenta</p>
                </div>
                {children}
                <p className="text-center mt-6 text-sm text-[#A0AEC0] font-light">
                    &copy; 2026 CANDY - Potenciado por Agentes
                </p>
            </div>
        </div>
    );
}