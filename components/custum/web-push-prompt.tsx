"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, X } from "lucide-react";
import { isWebPushConfigured, registerWebPush } from "@/services/web-push";
import { authStore } from "@/store/auth-store";

type PromptState = "checking" | "prompt" | "loading" | "error" | "blocked" | "unsupported" | "hidden";

export function WebPushPrompt() {
  const [state, setState] = useState<PromptState>("checking");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const session = authStore.getState().session;
      if (!session || session.user.role === "admin") {
        setState("hidden");
        return;
      }
      if (!isWebPushConfigured() || !("Notification" in window) || !("serviceWorker" in navigator) || !window.isSecureContext) {
        setState("unsupported");
        console.log(state,": Les notifications push nécessitent un navigateur compatible, une connexion HTTPS et une configuration Firebase Web valide.");
        return;
      }

      if (Notification.permission === "denied") {
        setState("blocked");
        return;
      }
      if (Notification.permission === "default") {
        setState("prompt");
        return;
      }

      try {
        await registerWebPush();
        if (active) setState("hidden");
      } catch (cause) {
        if (!active) return;
        setMessage(cause instanceof Error ? cause.message : "Impossible d’enregistrer ce navigateur.");
        setState("error");
        console.error(cause instanceof Error ? cause.message : "Impossible d’enregistrer ce navigateur.");
      }
    }

    void initialize();
    return () => { active = false; };
  }, []);

  async function activate() {
    setState("loading");
    setMessage(null);
    try {
      await registerWebPush();
      setState("hidden");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Impossible d’activer les notifications.");
      setState(Notification.permission === "denied" ? "blocked" : "error");
    }
  }

  if (state === "checking" || state === "hidden") return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="web-push-title"
        aria-describedby="web-push-description"
        className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl"
      >
        {state === "prompt" && (
          <button type="button" onClick={() => setState("hidden")} aria-label="Fermer" className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X className="size-5" />
          </button>
        )}
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          {state === "blocked" || state === "unsupported" ? <Bell className="size-8" /> : <BellRing className="size-8" />}
        </span>
        <h2 id="web-push-title" className="mt-5 text-xl font-bold text-slate-900">
          {state === "blocked" ? "Notifications bloquées" : state === "unsupported" ? "Notifications indisponibles" : "Ne manquez aucune notification"}
        </h2>
        <p id="web-push-description" className="mt-3 text-sm leading-6 text-slate-600">
          {state === "blocked"
            ? "Les notifications sont bloquées dans les paramètres de votre navigateur. Autorisez-les pour MediLink depuis les paramètres du site, puis rechargez la page."
            : state === "unsupported"
              ? "Les notifications nécessitent un navigateur compatible, une connexion valide."
              : "Echec de l'activation."}
        </p>
        {message && <p role="alert" className="mt-3 text-sm text-red-600">{message}</p>}
        {(state === "prompt" || state === "error" || state === "loading") && (
          <button
            type="button"
            onClick={() => void activate()}
            disabled={state === "loading"}
            className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {state === "loading" ? "Activation en cours…" : state === "error" ? "Réessayer l’activation" : "Activer les notifications"}
          </button>
        )}
        {state !== "loading" && (
          <button type="button" onClick={() => setState("hidden")} className="mt-3 w-full rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
            {state === "blocked" || state === "unsupported" ? "Fermer" : "Plus tard"}
          </button>
        )}
      </section>
    </div>
  );
}
