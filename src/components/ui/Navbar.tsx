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
        <nav className="flex items-center justify-between px-6 py-3 bg-[#FAF8F5] text-[#152A47] shadow-sm border-b border-[#EAEAEA]">
            <div className="text-lg font-extrabold tracking-wide">
                CANDY <span className="text-[#00B4D8]">.</span>
            </div>

            <div className="flex gap-4 items-center text-sm font-medium">
                <Link href="/" className="text-[#152A47]/90 hover:underline">Inicio</Link>
                <Link href="/login" className="px-3 py-1 rounded-full border border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10 transition">Login</Link>
                <Link href="/register" className="px-3 py-1 rounded-full bg-[#E07A5F] text-white hover:bg-[#d66a54] transition">Register</Link>
                {isLogged && <Link href="/dashboard" className="px-3 py-1 rounded-full bg-[#152A47] text-white">Dashboard</Link>}
            </div>
        </nav>
    );
}