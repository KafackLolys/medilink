"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import type { LoginResponse, RegisterableRole, AuthenticatedUser } from "@/services/auth-service";
import { publicApiRequest } from "@/services/http";
import { authStore } from "@/store/auth-store";
import { setBrowserRoleCookie } from "@/lib/client-auth-session";

const API = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type Status = { registered: false } | { registered: true; user: AuthenticatedUser };

function authClient() {
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
    throw new Error("Google n'est pas configuré. Renseignez les variables publiques Firebase sur Vercel.");
  }
  return getAuth(getApps().length ? getApp() : initializeApp(firebaseConfig));
}

async function googleToken(user: User) {
  const result = await user.getIdTokenResult(true);
  return result.token;
}

async function saveSession(user: User, profile: AuthenticatedUser) {
  const result = await user.getIdTokenResult(true);
  const expiresIn = Math.max(1, Math.floor((new Date(result.expirationTime).getTime() - Date.now()) / 1000));
  const response: LoginResponse = {
    user: profile,
    idToken: result.token,
    refreshToken: user.refreshToken,
    expiresIn,
    tokenType: "Bearer",
  };
  // Existing MediLink refresh mechanism and role middleware remain unchanged.
  authStore.getState().setSession(response, true);
  setBrowserRoleCookie(profile.role, true);
  return profile.role === "admin" ? "/admin" : profile.role === "doctor" ? "/medecin" : "/patient";
}

export async function startGoogleAuth(): Promise<{ redirect?: string; needsRole?: true }> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const credential = await signInWithPopup(authClient(), provider);
  const status = await publicApiRequest<Status>(`${API}/auth/google/status`, {
    method: "POST", body: JSON.stringify({ idToken: await googleToken(credential.user) }),
  });
  if (!status.registered) return { needsRole: true };
  return { redirect: await saveSession(credential.user, status.user) };
}

export async function finishGoogleRegistration(role: RegisterableRole): Promise<string> {
  if (role !== "patient" && role !== "doctor") throw new Error("Profil invalide.");
  const user = authClient().currentUser;
  if (!user) throw new Error("Session Google expirée. Recommencez la connexion.");
  const response = await publicApiRequest<{ user: AuthenticatedUser }>(`${API}/auth/google/complete`, {
    method: "POST", body: JSON.stringify({ idToken: await googleToken(user), role }),
  });
  return saveSession(user, response.user);
}

export async function cancelGoogleRegistration(): Promise<void> {
  const auth = authClient();
  if (auth.currentUser) await signOut(auth);
}
