"use client";

import { useState } from "react";
import {
  authService,
  type LoginRequest,
  type RegisterRequest,
} from "@/services/auth-service";
import { authStore } from "@/store/auth-store";
import { clearBrowserSession, setBrowserRoleCookie } from "@/lib/client-auth-session";

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
    setBrowserRoleCookie(response.user.role, rememberMe);
    return response;
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // Ignorer les erreurs de déconnexion API
    }
    clearBrowserSession();
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
