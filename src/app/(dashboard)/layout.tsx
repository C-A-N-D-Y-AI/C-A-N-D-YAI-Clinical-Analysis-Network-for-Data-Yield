import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAccessToken } from "@/lib/jwt";

export const metadata: Metadata = {
    title: "CANDY - Dashboard",
    description: "Panel de control del sistema de análisis clínico",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Proteger toda la ruta de (dashboard)
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        redirect("/login");
    }

    const user = validateAccessToken(token);

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "ADMIN") {
        redirect("/"); // Si no es admin, lo mandamos al inicio
    }

    return (
        <div className="min-h-[calc(100vh-65px)] bg-[#050A18] text-[#FFFFFF] font-sans">
            {/* Aquí podrías añadir una barra lateral o navegación específica de dashboard */}
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
