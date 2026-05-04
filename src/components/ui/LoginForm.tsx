'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {

        try {
            e.preventDefault();
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "error");
            }
            await Swal.fire({
                title: `Bienvenido a CANDY, ${email}!`,
                text: 'Has iniciado sesión correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

            localStorage.setItem("usuario-logueado", JSON.stringify({ email }));
            router.push('/dashboard');

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un problema";
            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Reintentar',
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <h2 className="text-xl font-semibold text-[#152A47] text-center mb-2">Ingresa a tu cuenta</h2>

            <div className="space-y-2">
                <label className="text-sm font-medium text-[#152A47] ml-1">Correo Electrónico</label>
                <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-white border border-[#EAEAEA] p-3 rounded-xl text-[#152A47] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-[#152A47] ml-1">Contraseña</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#EAEAEA] p-3 rounded-xl text-[#152A47] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-[#E07A5F] hover:bg-[#d66a54] text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#E07A5F]/20 active:scale-[0.98] mt-2"
            >
                Iniciar Sesión
            </button>

            <div className="text-center mt-2">
                <p className="text-sm text-gray-500">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-[#00B4D8] hover:underline font-medium transition-colors">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </form>
    );
}