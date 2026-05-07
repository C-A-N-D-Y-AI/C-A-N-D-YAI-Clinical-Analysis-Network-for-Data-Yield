import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAccessToken } from "@/lib/jwt";
import DashboardNavbar from "./_components/DashboardNavbar";

export const metadata: Metadata = {
    title: "C.A.N.D.Y — Dashboard",
    description: "Panel de control del sistema de análisis clínico.",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#050A18] text-[#FFFFFF] font-sans flex flex-col">
            <DashboardNavbar user={user} />
            <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
                {children}
            </main>
        </div>
    );
}
