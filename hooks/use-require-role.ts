"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authStore } from "@/store/auth-store";
import { canAccess, type AccountRole } from "@/lib/roles";

interface UseRequireRoleOptions {
  allowedRoles: AccountRole[];
  redirectTo?: string;
}

const ROLE_HOME: Record<AccountRole, string> = {
  patient: "/patient",
  doctor: "/medecin",
  admin: "/admin",
};

/**
 * Hook qui vérifie que l'utilisateur connecté possède l'un des rôles autorisés.
 * Redirige automatiquement en cas d'accès refusé.
 */
export function useRequireRole(options: UseRequireRoleOptions) {
  const { allowedRoles, redirectTo } = options;
  const pathname = usePathname();
  const router = useRouter();
  const session = authStore.getState().session;
  const userRole = session?.user.role as AccountRole | undefined;

  useEffect(() => {
    if (!session) return;
    const segment = pathname.split("/").filter(Boolean)[0];
    const hasAccess = allowedRoles.some((role) => canAccess(role, segment));
    if (!hasAccess) {
      const target = redirectTo ?? ROLE_HOME[userRole ?? "patient"];
      router.replace(target);
    }
  }, [pathname, userRole, session, allowedRoles, redirectTo, router]);

  return { userRole, isAuthenticated: !!session };
}
