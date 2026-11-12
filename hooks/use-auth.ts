"use client";

import { useState } from "react";
import {
  authService,
  type LoginRequest,
  type RegisterRequest,
} from "@/services/auth-service";
import { authStore } from "@/store/auth-store";

const AUTH_COOKIE_NAME = "medilink-role";
const AUTH_COOKIE_OPTIONS = "path=/; SameSite=Lax; Max-Age=604800"; // 7 jours

function setAuthCookie(role: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${role}; ${AUTH_COOKIE_OPTIONS}`;
}

function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; Max-Age=0`;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);

  async function run<T>(operation: () => Promise<T>): Promise<T> {
    setLoading(true);
    try {
      return await operation();
    } finally {
      setLoading(false);
    }
  }

  async function login(data: LoginRequest, rememberMe: boolean) {
    const response = await run(() => authService.login(data));
    authStore.getState().setSession(response, rememberMe);
    // Définit le cookie côté client pour que le middleware puisse lire le rôle
    setAuthCookie(response.user.role);
    return response;
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // Ignorer les erreurs de déconnexion API
    }
    authStore.getState().clearSession();
    clearAuthCookie();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  }

  return {
    loading,
    login,
    logout,
    register: (data: RegisterRequest) => run(() => authService.register(data)),
  };
}
