"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authStore } from "@/store/auth-store";
import { canAccess, type AccountRole } from "@/lib/roles";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: AccountRole[];
  fallback?: React.ReactNode;
}

const ROLE_HOME: Record<AccountRole, string> = {
  patient: "/patient",
  doctor: "/medecin",
  admin: "/admin",
};

/**
 * RoleGuard vérifie que l'utilisateur connecté possède l'un des rôles autorisés
 * pour accéder à la route actuelle. En cas d'échec, il redirige vers la page d'accueil
 * du rôle de l'utilisateur ou vers "/unauthorized".
 */
export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authStore.getState().session;
  const userRole = session?.user.role as AccountRole | undefined;

  useEffect(() => {
    const segment = pathname.split("/").filter(Boolean)[0];
    if (!canAccess(userRole, segment)) {
      if (userRole) {
        router.replace(ROLE_HOME[userRole]);
      } else {
        router.replace("/unauthorized");
      }
    }
  }, [pathname, userRole, router]);

  if (!session) return null; // encore en chargement

  const segment = pathname.split("/").filter(Boolean)[0];
  if (!canAccess(userRole, segment)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
