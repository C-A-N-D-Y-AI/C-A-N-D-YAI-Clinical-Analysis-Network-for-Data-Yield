import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-slate-900 text-white shadow-md">
            <nav className="text-xl font-bold-tracking-wider">
                RIWI <span className="text-red-500">.</span>IA
            </nav>

            <nav className="flex gap-6 text-sm font-medium">
                <Link href="/">Inicio</Link>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
                <Link href="/dashboard">Dashboard</Link>
            </nav>
        </nav>
    );
}