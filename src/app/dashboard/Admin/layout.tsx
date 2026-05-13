import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAccessToken } from "@/lib/jwt";
import DashboardNavbar from "./admin-dashboard/_components/DashboardNavbar";

export const metadata: Metadata = {
  title: "C.A.N.D.Y - Admin",
  description: "Panel de administracion del sistema.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");

  const user = validateAccessToken(token);

  if (!user) redirect("/login");

  if (user.role !== "ADMIN") redirect("/unauthorized");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <DashboardNavbar user={user} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
        {children}
      </main>
    </div>
  );
}
