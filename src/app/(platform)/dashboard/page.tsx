"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        async function checkAccess() {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                // Si el servidor responde 401 (lo que te pasa ahora), te manda a loguear
                if (res.status === 401) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();

                if (data.success && data.user) {
                    if (data.user.role === "ADMIN") {
                        router.push("/dashboard/Admin");
                    } else {
                        router.push("/dashboard/users");
                    }
                } else {
                    router.push("/login");
                }
            } catch {
                router.push("/login");
            }
        }
        checkAccess();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="text-sky-500 animate-pulse font-mono text-xs uppercase tracking-widest">
                Verificando credenciales...
            </div>
        </div>
    );
}
