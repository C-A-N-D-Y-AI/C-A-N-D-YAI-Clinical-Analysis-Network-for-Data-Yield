import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  userId: number;
  role: "ADMIN" | "USER";
}

// Rate limiting en memoria
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

const ROUTE_CONFIG = {
  authPages: ["/login", "/register"],
  protectedPages: ["/dashboard", "/admin-dashboard"],
  adminPages: ["/dashboard/admin", "/dashboard/users", "/admin-dashboard"],
  publicApiRoutes: [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
  ],
  adminApiRoutes: [
    "/api/users",
  ],
  protectedApiRoutes: [
    "/api/auth/logout",
    "/api/auth/me",
    "/api/document",
  ],
} as const;

function matchesAny(path: string, routes: readonly string[]): boolean {
  return routes.some((route) => path.startsWith(route));
}

function apiUnauthorized(message: string, status: 401 | 403) {
  return NextResponse.json({ error: message }, { status });
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;
  const pathLower = pathname.toLowerCase();
  const method = request.method;

  const isApiRoute = pathLower.startsWith("/api/");

  const isPublicApiRoute    = matchesAny(pathLower, ROUTE_CONFIG.publicApiRoutes);
  const isAdminApiRoute     = matchesAny(pathLower, ROUTE_CONFIG.adminApiRoutes);
  const isProtectedApiRoute = matchesAny(pathLower, ROUTE_CONFIG.protectedApiRoutes);

  const isAuthPage      = ROUTE_CONFIG.authPages.some((p) => pathLower === p);
  const isProtectedPage = matchesAny(pathLower, ROUTE_CONFIG.protectedPages);
  const isAdminPage     = matchesAny(pathLower, ROUTE_CONFIG.adminPages);

  // Rate limiting en login y register
  if (isApiRoute && isPublicApiRoute && method === "POST") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera 15 minutos." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }
  }

  // Rutas API públicas — pasar sin token
  if (isApiRoute && isPublicApiRoute) {
    return NextResponse.next();
  }

  // Rutas API protegidas — requieren token
  if (isApiRoute && (isAdminApiRoute || isProtectedApiRoute)) {
    if (!token) {
      return apiUnauthorized("No autenticado", 401);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const decoded = payload as unknown as JWTPayload;

      if (isAdminApiRoute && decoded.role !== "ADMIN") {
        return apiUnauthorized("Acceso denegado: se requiere rol ADMIN", 403);
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", String(decoded.userId));
      requestHeaders.set("x-user-role", decoded.role);

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      const response = apiUnauthorized("Token inválido o expirado", 401);
      response.cookies.delete("accessToken");
      return response;
    }
  }

  // Páginas protegidas sin token — redirigir a login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Con token — verificar acceso
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const decoded = payload as unknown as JWTPayload;

      // Ya autenticado → no dejar entrar a login/register
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Páginas admin → verificar rol
      if (isAdminPage && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
    "/login",
    "/register",
    "/unauthorized",
    "/api/:path*",
  ],
};