import { authStore } from "@/store/auth-store";
import { authRoutes } from "@/routes/auth-routes";
import { clearBrowserSession } from "@/lib/client-auth-session";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorPayload = { message?: string | string[]; error?: string; statusCode?: number };
type RefreshPayload = {
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType?: string;
};

let refreshInProgress: Promise<boolean> | null = null;

function getErrorMessage(payload: unknown, status: number): string {
  const errorPayload = payload as ErrorPayload | undefined;
  return Array.isArray(errorPayload?.message)
    ? errorPayload.message.join(", ")
    : errorPayload?.message ?? errorPayload?.error ?? `La requête a échoué (${status}).`;
}

function redirectToLogin() {
  clearBrowserSession();
  if (typeof window !== "undefined") {
    window.location.replace("/login");
  }
}

async function refreshSession(): Promise<boolean> {
  const session = authStore.getState().session;
  if (!session?.refreshToken) {
    redirectToLogin();
    return false;
  }

  const refreshToken = session.refreshToken;
  try {
    const response = await fetch(authRoutes.Refresh.url, {
      method: authRoutes.Refresh.method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
    const body = await response.text();
    const payload: unknown = body ? JSON.parse(body) : undefined;
    if (!response.ok) {
      throw new ApiError(getErrorMessage(payload, response.status), response.status);
    }

    const currentSession = authStore.getState().session;
    if (currentSession?.refreshToken !== refreshToken) {
      return Boolean(currentSession);
    }

    const refreshed = payload as RefreshPayload;
    authStore.getState().updateTokens({
      idToken: refreshed.idToken,
      refreshToken: refreshed.refreshToken,
      expiresIn: refreshed.expiresIn,
      tokenType: refreshed.tokenType ?? session.tokenType,
    });
    return true;
  } catch {
    const currentSession = authStore.getState().session;
    if (currentSession?.refreshToken === refreshToken || !currentSession) {
      redirectToLogin();
      return false;
    }
    return true;
  }
}

function refreshOnce(): Promise<boolean> {
  if (!refreshInProgress) {
    refreshInProgress = refreshSession().finally(() => {
      refreshInProgress = null;
    });
  }
  return refreshInProgress;
}

async function sendRequest(url: string, init: RequestInit, useCurrentToken = false): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const session = authStore.getState().session;
  if (session && (useCurrentToken || !headers.has("Authorization"))) {
    headers.set("Authorization", `${session.tokenType} ${session.idToken}`);
  }

  return fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
}

export async function apiRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  let response = await sendRequest(url, init);
  const body = await response.text();
  let payload: unknown = body ? JSON.parse(body) : undefined;

  if (!response.ok) {
    const errorPayload = payload as ErrorPayload | undefined;
    const unauthorized = errorPayload?.statusCode === 401 || response.status === 401;
    if (unauthorized && authStore.getState().session && await refreshOnce()) {
      response = await sendRequest(url, init, true);
      const retryBody = await response.text();
      payload = retryBody ? JSON.parse(retryBody) : undefined;
      if (response.ok) {
        return payload as T;
      }
      if ((payload as ErrorPayload | undefined)?.statusCode === 401 || response.status === 401) {
        redirectToLogin();
      }
    } else if (!authStore.getState().session) {
      redirectToLogin();
    }
    throw new ApiError(getErrorMessage(payload, response.status), response.status);
  }

  return payload as T;
}


export async function publicApiRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await sendRequest(url, init);
  const body = await response.text();
  const payload: unknown = body ? JSON.parse(body) : undefined;

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, response.status), response.status);
  }

  return payload as T;
}