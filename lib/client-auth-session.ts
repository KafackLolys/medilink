import { authStore } from "@/store/auth-store";

const COOKIE_NAME = "medilink-role";

export function setBrowserRoleCookie(role: "patient" | "doctor" | "admin", rememberMe: boolean) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const persistence = rememberMe ? "; Max-Age=604800" : "";
  document.cookie = `${COOKIE_NAME}=${role}; Path=/; SameSite=Lax${persistence}${secure}`;
}

export function clearBrowserSession() {
  if (typeof window === "undefined") return;
  authStore.getState().clearSession();
  document.cookie = `${COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`;
}
