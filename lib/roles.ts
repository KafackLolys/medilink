import type { AccountRole } from "./database";

export type { AccountRole };

export type RoleRouteConfig = Record<AccountRole, string[]>;

/**
 * Préfixes de route autorisés par rôle.
 * Une route est accessible si son premier segment correspond à un préfixe autorisé pour le rôle.
 */
export const ROLE_ROUTES: RoleRouteConfig = {
  patient: ["/patient"],
  doctor: ["/medecin"],
  admin: ["/admin"],
};

/**
 * Redirige un utilisateur vers sa page d'accueil selon son rôle.
 */
export const ROLE_HOME: Record<AccountRole, string> = {
  patient: "/patient",
  doctor: "/medecin",
  admin: "/admin",
};

/**
 * Extrait le premier segment de route après /(private).
 * Ex: "/medecin/disponibilites" → "medecin"
 */
export function getRouteSegment(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  // segments typiquement : ["medecin", "disponibilites"] ou ["patient", "profil"]
  return segments.length > 0 ? segments[0] : null;
}

/**
 * Vérifie si un rôle donné peut accéder à un segment de route.
 */
export function canAccess(role: AccountRole | undefined, segment: string | null): boolean {
  if (!role || !segment) return false;
  const allowed = ROLE_ROUTES[role];
  if (!allowed) return false;
  return allowed.some((prefix) => segment === prefix.slice(1));
}
