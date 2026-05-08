import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  userId: number;
  role: "ADMIN" | "User";
}

const ROUTE_CONFIG = {
  authPages: ["/login", "/register"],
  protectedPages: ["/dashboard"],
  adminPages: ["/dashboard/admin"],
  publicApiRoutes: [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
  ],
  protectedApiRoutes: [
    "/api/auth/logout",
    "/api/auth/me",
    "/api/document",
    "/api/users/update",
    "/api/users/delete-everything",
  ],
} as const;

function matchesAny(path: string, routes: readonly string[]): boolean {
  return routes.some((route) => path.startsWith(route));
}

function apiUnauthorized(message: string, status: 401 | 403) {
  return NextResponse.json({ error: message }, { status });
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;
  const pathLower = pathname.toLowerCase();

  const isApiRoute = pathLower.startsWith("/api/");

  const isPublicApiRoute = matchesAny(pathLower, ROUTE_CONFIG.publicApiRoutes);
  const isProtectedApiRoute = matchesAny(pathLower, ROUTE_CONFIG.protectedApiRoutes);
  const isAdminApiRoute =
    pathLower === "/api/users" || /^\/api\/users\/\d+$/.test(pathLower);

  const isAuthPage = ROUTE_CONFIG.authPages.some((p) => pathLower === p);
  const isProtectedPage = matchesAny(pathLower, ROUTE_CONFIG.protectedPages);
  const isAdminPage = matchesAny(pathLower, ROUTE_CONFIG.adminPages);

  if (isApiRoute && isPublicApiRoute) {
    return NextResponse.next();
  }

  if (isApiRoute && (isAdminApiRoute || isProtectedApiRoute)) {
    if (!token) {
      return apiUnauthorized("No autenticado", 401);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const decoded = payload as unknown as JWTPayload;

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

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const decoded = payload as unknown as JWTPayload;

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

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
    "/login",
    "/register",
    "/unauthorized",
    "/api/:path*",
  ],
};
