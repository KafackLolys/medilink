import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthenticatedUser, LoginResponse } from "@/services/auth-service";

export interface AuthSession {
  user: AuthenticatedUser;
  idToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: number;
}

interface PersistedAuthState {
  session: AuthSession | null;
  rememberMe: boolean;
}

interface AuthState extends PersistedAuthState {
  setSession: (response: LoginResponse, rememberMe: boolean) => AuthSession;
  updateTokens: (tokens: Pick<AuthSession, "idToken" | "refreshToken" | "tokenType"> & { expiresIn: number }) => void;
  setRememberMe: (rememberMe: boolean) => void;
  clearSession: () => void;
}

const authStorage = createJSONStorage<PersistedAuthState>(() => {
  // Importable et utilisable partout, y compris le SSR / Edge (middleware) :
  // window, localStorage et sessionStorage n'existent pas côté serveur.
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }
  return {
    // A non-remembered session survives full page navigation within the same tab.
    getItem: (name) => {
      try {
        return window.sessionStorage.getItem(name) ?? window.localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        const persisted = JSON.parse(value) as { state?: PersistedAuthState };
        if (persisted.state?.rememberMe) {
          window.localStorage.setItem(name, value);
          window.sessionStorage.removeItem(name);
        } else if (persisted.state?.session) {
          window.sessionStorage.setItem(name, value);
          window.localStorage.removeItem(name);
        } else {
          window.sessionStorage.removeItem(name);
          window.localStorage.removeItem(name);
        }
      } catch {
        // Stockage indisponible (navigation privée, quota bloqué, etc.) : on ignore silencieusement.
      }
    },
    removeItem: (name) => {
      try {
        window.localStorage.removeItem(name);
        window.sessionStorage.removeItem(name);
      } catch {
        // Stockage indisponible : on ignore silencieusement.
      }
    },
  };
});

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      rememberMe: false,
      setSession: (response, rememberMe) => {
        if (
          !response.idToken
          || !response.refreshToken
          || !response.tokenType
          || !Number.isFinite(response.expiresIn)
          || response.expiresIn <= 0
        ) {
          throw new Error("La réponse de connexion ne contient pas de jetons valides.");
        }

        const session: AuthSession = {
          user: response.user,
          idToken: response.idToken,
          refreshToken: response.refreshToken,
          tokenType: response.tokenType,
          expiresAt: Date.now() + response.expiresIn * 1000,
        };
        set({ session, rememberMe });
        return session;
      },
      updateTokens: ({ idToken, refreshToken, tokenType, expiresIn }) => {
        if (!idToken || !refreshToken || !tokenType || !Number.isFinite(expiresIn) || expiresIn <= 0) {
          throw new Error("La réponse de renouvellement ne contient pas de jetons valides.");
        }

        set((state) => {
          if (!state.session) {
            throw new Error("Aucune session à renouveler.");
          }
          return {
            session: {
              ...state.session,
              idToken,
              refreshToken,
              tokenType,
              expiresAt: Date.now() + expiresIn * 1000,
            },
          };
        });
      },
      setRememberMe: (rememberMe) => set({ rememberMe }),
      clearSession: () => set({ session: null, rememberMe: false }),
    }),
    {
      name: "medilink-auth",
      storage: authStorage,
      partialize: (state): PersistedAuthState => ({
        session: state.session,
        rememberMe: state.rememberMe,
      }),
    },
  ),
);
