import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CANDY - Dashboard",
    description: "Panel de control del sistema de análisis clínico",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Aquí podrías añadir una barra lateral o navegación específica de dashboard */}
            <main className="p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
