import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Proxy: redirect unauthenticated navigation only.
 * Never import Zustand/localStorage in this server-side file.
 *
 * medilink-role is a client-set routing hint, NOT proof of authentication.
 * The client guard reconciles it with the hydrated session; the API verifies
 * Firebase credentials on every protected request.
 */
const PRIVATE_ROUTE = /^\/(patient|medecin|admin)(?:\/|$)/;
const ROLES = new Set(["patient", "doctor", "admin"]);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!PRIVATE_ROUTE.test(pathname)) {
    return NextResponse.next();
  }

  const role = request.cookies.get("medilink-role")?.value;
  if (role && ROLES.has(role)) {
    // Do not redirect between role homes based on an unverified/stale cookie.
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  const response = NextResponse.redirect(loginUrl);
  if (role) response.cookies.delete("medilink-role");
  return response;
}

export const config = {
  matcher: ["/patient/:path*", "/medecin/:path*", "/admin/:path*"],
};
