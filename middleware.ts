import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Rôles autorisés par préfixe de route.
 * Une route est accessible si son premier segment correspond à un préfixe autorisé pour le rôle stocké dans le cookie.
 */
const ROLE_ROUTES: Record<string, string[]> = {
  patient: ["/patient"],
  doctor: ["/medecin"],
  admin: ["/admin"],
};

const ROLE_HOME: Record<string, string> = {
  patient: "/patient",
  doctor: "/medecin",
  admin: "/admin",
};

const PRIVATE_PREFIX = "/(private)";
const LOGIN_PATH = "/login";
const UNAUTHORIZED_PATH = "/unauthorized";

function getRoleFromRequest(request: NextRequest): string | null {
  const role = request.cookies.get("medilink-role")?.value;
  return role ?? null;
}

function canAccess(role: string | null, pathname: string): boolean {
  if (!role) return false;
  const segment = pathname.split("/").filter(Boolean)[0];
  const allowed = ROLE_ROUTES[role];
  if (!allowed) return false;
  return allowed.some((prefix) => segment === prefix.slice(1));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRoleFromRequest(request);

  // Détermine si la route est une route privée (sous /(private))
  const isPrivateRoute = pathname.startsWith("/(private)") || pathname.startsWith("/private");

  // Si l'utilisateur n'a pas de rôle (non connecté) et tente d'accéder à une route privée
  if (isPrivateRoute && !role) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // Si l'utilisateur a un rôle mais tente d'accéder à une route d'un autre rôle
  if (isPrivateRoute && role && !canAccess(role, pathname)) {
    const home = ROLE_HOME[role] ?? "404";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // Si l'utilisateur est connecté (a un rôle) et essaie d'accéder à / ou /login, rediriger vers son espace
  if ((pathname === LOGIN_PATH && role) || (pathname === "/" && role)) {
    const home = ROLE_HOME[role] ?? "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
