import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAccessToken } from './lib/jwt';

/**
 * Mapa en memoria para Rate Limiting.
 * Clave: IP del cliente. Valor: { count, resetAt }
 * Nota: Para deployments multi-instancia usar Redis en su lugar.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 10;          // Máximo 10 intentos
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // Ventana de 15 minutos

function getRateLimitedResponse() {
    return NextResponse.json(
        { message: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." },
        {
            status: 429,
            headers: { "Retry-After": "900" },
        }
    );
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        // Primera solicitud o ventana expirada: reiniciar contador
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true; // Permitido
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return false; // Bloqueado
    }

    // Incrementar contador
    entry.count++;
    return true; // Permitido
}

/**
 * Proxy de Next.js 16 para:
 * 1. Rate limiting en rutas de autenticación
 * 2. Protección de rutas API que requieren autenticación
 */
export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const method = req.method;

    // ─── Rate Limiting en rutas de Auth ───────────────────────────────────────
    const isAuthRoute = pathname.startsWith('/api/auth/login') || 
                        pathname.startsWith('/api/auth/register');

    if (isAuthRoute && method === 'POST') {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            ?? req.headers.get('x-real-ip')
            ?? 'anonymous';

        if (!checkRateLimit(ip)) {
            return getRateLimitedResponse();
        }
    }

    // ─── Protección de rutas API privadas ─────────────────────────────────────
    if (pathname.startsWith('/api/agents') || pathname.startsWith('/api/admin')) {
        let token = req.cookies.get('accessToken')?.value;

        if (!token) {
            const authHeader = req.headers.get('authorization');
            token = authHeader?.split(' ')[1];
        }

        if (!token) {
            return NextResponse.json({ message: 'No autorizado: Falta token' }, { status: 401 });
        }

        const user = validateAccessToken(token);
        if (!user) {
            return NextResponse.json({ message: 'Sesión expirada o token inválido' }, { status: 401 });
        }

        const isWriteAction = ['POST', 'PUT', 'DELETE'].includes(method);

        if (pathname.startsWith('/api/agents') && isWriteAction && user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Acceso restringido a administradores' }, { status: 403 });
        }

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', user.id.toString());
        requestHeaders.set('x-user-role', user.role);

        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/auth/login',
        '/api/auth/register',
        '/api/agents/:path*',
        '/api/admin/:path*',
    ],
};
