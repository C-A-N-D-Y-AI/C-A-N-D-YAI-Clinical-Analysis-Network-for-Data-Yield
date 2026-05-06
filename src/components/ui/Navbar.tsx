"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("usuario-logueado");
            setIsLogged(Boolean(raw));
        } catch (e) {
            setIsLogged(false);
        }
    }, []);

    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-[#050A18] text-[#FFFFFF] shadow-md border-b border-[#1A263D]">
            <div className="text-lg font-extrabold tracking-wide text-[#FFFFFF]">
                CANDY <span className="text-[#0091DA]">.</span>
            </div>

            <div className="flex gap-4 items-center text-sm font-medium">
                <Link href="/" className="text-[#A0AEC0] hover:text-[#FFFFFF] transition-colors">Inicio</Link>
                <Link href="/login" className="px-3 py-1 rounded-full border border-[#1A263D] text-[#FFFFFF] hover:border-[#537FE7] hover:bg-[#1A263D]/50 transition">Acceder</Link>
                <Link href="/register" className="px-3 py-1 rounded-full bg-[#0091DA] text-[#FFFFFF] hover:bg-[#007AB8] transition">REGISTER</Link>
                {isLogged && <Link href="/dashboard" className="px-3 py-1 rounded-full bg-[#0D1525] border border-[#1A263D] text-[#FFFFFF] hover:border-[#0091DA] transition">Dashboard</Link>}
            </div>
        </nav>
    );
}