"use client";

import { useState } from "react";
import {
  authService,
  type LoginRequest,
  type RegisterRequest,
} from "@/services/auth-service";
import { authStore } from "@/store/auth-store";

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
    return response;
  }

  return {
    loading,
    login,
    register: (data: RegisterRequest) => run(() => authService.register(data)),
  };
}
