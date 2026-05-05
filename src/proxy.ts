import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from './lib/jwt';

/**
 * Proxy para la protección de rutas API.
 * Verifica la validez del token de acceso presente en las cookies.
 */
export default async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const method = req.method;

    // Intentar obtener el token de las cookies (preferido) o del header Authorization
    let token = req.cookies.get('accessToken')?.value;

    if (!token) {
        const authHeader = req.headers.get('authorization');
        token = authHeader?.split(' ')[1];
    }

    // Rutas que requieren autenticación
    if (pathname.startsWith('/api/agents') || pathname.startsWith('/api/admin')) {
        if (!token) {
            return NextResponse.json({ message: 'No autorizado: Falta token' }, { status: 401 });
        }

        const user = validateAccessToken(token);
        if (!user) {
            return NextResponse.json({ message: 'Sesión expirada o token inválido' }, { status: 401 });
        }

        const isWriteAction = ['POST', 'PUT', 'DELETE'].includes(method);

        // Control de acceso basado en roles
        if (pathname.startsWith('/api/agents')) {
            if (isWriteAction && user.role !== 'ADMIN') {
                return NextResponse.json({ message: 'Acceso restringido a administradores' }, { status: 403 });
            }
        }

        // Pasar información del usuario a los headers para que las rutas API la usen
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', user.id.toString());
        requestHeaders.set('x-user-role', user.role);

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/agents/:path*', '/api/admin/:path*'],
};
