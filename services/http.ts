import { authStore } from "@/store/auth-store";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorPayload = { message?: string | string[]; error?: string, statusCode: number };

export async function apiRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const session = authStore.getState().session;
  if (session && !headers.has("Authorization")) {
    headers.set("Authorization", `${session.tokenType} ${session.idToken}`);
  }

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
  const body = await response.text();
  const payload: unknown = body ? JSON.parse(body) : undefined;

  if (!response.ok) {
    const errorPayload = payload as ErrorPayload | undefined;
    if (errorPayload?.statusCode === 401) {
      authStore.getState().clearSession();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    const message = Array.isArray(errorPayload?.message)
      ? errorPayload.message.join(", ")
      : errorPayload?.message ?? errorPayload?.error ?? `La requête a échoué (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
