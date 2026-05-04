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
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#FAF8F5] overflow-hidden relative">
            <div className="absolute top-8 left-8">
                <div className="inline-block px-3 py-1 rounded-full bg-[#152A47]/8 border border-[#152A47]/10">
                    <span className="text-xs font-bold text-[#152A47] tracking-widest uppercase">Seguridad AI</span>
                </div>
            </div>

            <div className="max-w-md w-full bg-[#F3ECE3] border border-[#DCAE8A]/30 rounded-3xl p-8 shadow-lg shadow-[#152A47]/6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-[#152A47] tracking-tighter">
                        CANDY <span className="text-[#00B4D8]">.</span>
                    </h1>
                    <p className="mt-2 text-sm text-[#152A47]/80">Accede a tu cuenta</p>
                </div>
                {children}
                <p className="text-center mt-6 text-sm text-[#152A47]/60 font-light">
                    &copy; 2026 CANDY - Potenciado por Agentes
                </p>
            </div>
        </div>
    );
}