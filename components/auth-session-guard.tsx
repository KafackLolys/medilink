"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "zustand";
import { authStore } from "@/store/auth-store";
import { clearBrowserSession, setBrowserRoleCookie } from "@/lib/client-auth-session";

const ROLE_HOME = {
  patient: "/patient",
  doctor: "/medecin",
  admin: "/admin",
} as const;

type Role = keyof typeof ROLE_HOME;

/**
 * Wait for Zustand persistence to hydrate before checking the browser session.
 * A role cookie alone is never enough to render a private page.
 */
export function AuthSessionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useStore(authStore, (state) => state.session);
  const rememberMe = useStore(authStore, (state) => state.rememberMe);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = authStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(authStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  const role = session?.user.role as Role | undefined;
  const validSession = Boolean(
    session?.idToken && session.refreshToken && session.tokenType &&
    session.user && role && Object.hasOwn(ROLE_HOME, role),
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!validSession || !role) {
      clearBrowserSession();
      router.replace("/login");
      return;
    }

    // Repair a missing role cookie (e.g. after manual cookie cleanup).
    setBrowserRoleCookie(role, rememberMe);

    const expectedPrefix = ROLE_HOME[role];
    if (pathname !== expectedPrefix && !pathname.startsWith(`${expectedPrefix}/`)) {
      router.replace(expectedPrefix);
    }
  }, [hydrated, validSession, role, rememberMe, pathname, router]);

  if (!hydrated || !validSession || !role) {
    return <div role="status" className="p-8 text-center text-sm text-muted">Vérification de votre session…</div>;
  }

  const expectedPrefix = ROLE_HOME[role];
  if (pathname !== expectedPrefix && !pathname.startsWith(`${expectedPrefix}/`)) {
    return <div role="status" className="p-8 text-center text-sm text-muted">Redirection vers votre espace…</div>;
  }

  return <>{children}</>;
}
