'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function RegisterForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {

        try {
            e.preventDefault();
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "error");
            }

            await Swal.fire({
                title: `¡Bienvenido a CANDY, ${firstName}!`,
                text: 'Tu cuenta ha sido creada. Por favor inicia sesión.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

            localStorage.setItem("usuario-registrado", JSON.stringify({ email }));
            router.push('/login');

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <h2 className="text-xl font-semibold text-[#152A47] text-center mb-2">Crea tu cuenta</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#152A47] ml-1">Nombre</label>
                    <input
                        type="text"
                        placeholder="Tu nombre"
                        className="w-full bg-white border border-[#EAEAEA] p-3 rounded-xl text-[#152A47] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] transition-all"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#152A47] ml-1">Apellido</label>
                    <input
                        type="text"
                        placeholder="Tu apellido"
                        className="w-full bg-white border border-[#EAEAEA] p-3 rounded-xl text-[#152A47] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] transition-all"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>
            </div>

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
                Registrar Cuenta
            </button>

            <div className="text-center mt-2">
                <p className="text-sm text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="text-[#00B4D8] hover:underline font-medium transition-colors">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </form>
    );
}