/** Route unique pour les conversations selon le rôle. */
export function messageHref(role: "patient" | "doctor", conversationId?: string | null): string {
  const search = new URLSearchParams();
  if (role === "patient") search.set("activeContent", "messages");
  if (conversationId) search.set("conversation", conversationId);
  const route = role === "patient" ? "/patient/profil" : "/medecin/messages";
  const query = search.toString();
  return query ? `${route}?${query}` : route;
}

/** Convertit uniquement les anciennes URLs internes patient. Aucun lien externe n'est accepté. */
export function normalizePatientInternalHref(value: string | null | undefined, fallback = "/patient"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  try {
    const url = new URL(value, "http://medilink.invalid");
    if (url.origin !== "http://medilink.invalid") return fallback;
    if (url.pathname === "/patient/messages" || url.pathname === "/patient/messages/") {
      return messageHref("patient", url.searchParams.get("conversation"));
    }
    if (!url.pathname.startsWith("/patient") && url.pathname !== "/") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
