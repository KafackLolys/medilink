"use client";

import { useStore } from "zustand";
import { authStore } from "@/store/auth-store";

export function useAuthSession() {
  return useStore(authStore, (state) => state.session);
}
