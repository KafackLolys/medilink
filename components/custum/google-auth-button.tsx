"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Stethoscope, UserRound, X } from "lucide-react";
import type { RegisterableRole } from "@/services/auth-service";
import { cancelGoogleRegistration, finishGoogleRegistration, startGoogleAuth } from "@/services/google-auth";

export function GoogleAuthButton({ label }: { label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [chooseRole, setChooseRole] = useState(false);
  const [role, setRole] = useState<RegisterableRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function begin() {
    setPending(true);
    setError(null);
    try {
      const outcome = await startGoogleAuth();
      if (outcome.needsRole) setChooseRole(true);
      if (outcome.redirect) router.replace(outcome.redirect);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connexion Google impossible.");
    } finally {
      setPending(false);
    }
  }

  async function complete() {
    if (!role) return;
    setPending(true);
    setError(null);
    try {
      const redirect = await finishGoogleRegistration(role);
      setChooseRole(false);
      router.replace(redirect);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Création du compte impossible.");
    } finally {
      setPending(false);
    }
  }

  async function cancel() {
    setChooseRole(false);
    setRole(null);
    setError(null);
    try { await cancelGoogleRegistration(); } catch { /* No application session exists yet. */ }
  }

  return <>
    <button type="button" onClick={() => void begin()} disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-base font-semibold text-ink transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:opacity-60">
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z" />
        <path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.6 13.7a6.6 6.6 0 0 1 0-4.2v-3H1.8a11 11 0 0 0 0 10.2l3.8-3z" />
        <path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11 11 0 0 0 1.8 6.5l3.8 3C6.5 6.8 9 5.4 12 5.4z" />
      </svg>
      {pending ? "Connexion en cours…" : label}
    </button>
    {error && !chooseRole && <p role="alert" className="mt-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {chooseRole && <div role="dialog" aria-modal="true" aria-labelledby="google-role-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div><h2 id="google-role-title" className="text-2xl font-extrabold text-night">Bienvenue sur MediLink</h2>
            <p className="mt-2 text-sm text-muted">Votre compte Google est reconnu. Quel espace souhaitez-vous créer ?</p></div>
          <button type="button" onClick={() => void cancel()} disabled={pending} aria-label="Fermer" className="rounded-lg p-2 hover:bg-slate-100"><X className="size-5" /></button>
        </div>
        <div role="radiogroup" aria-label="Type de compte" className="mt-6 space-y-3">
          {([{value:"patient",title:"Je suis patient",description:"Rechercher un médecin et publier des besoins de santé.",Icon:UserRound},
            {value:"doctor",title:"Je suis médecin",description:"Proposer des consultations après vérification professionnelle.",Icon:Stethoscope}] as const).map((choice) =>
            <button type="button" role="radio" aria-checked={role===choice.value} key={choice.value} onClick={() => setRole(choice.value)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left ${role===choice.value?"border-primary bg-primary/5":"border-slate-200 hover:border-primary/40"}`}>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><choice.Icon className="size-6" /></span>
              <span className="flex-1"><strong className="block text-ink">{choice.title}</strong><span className="text-sm text-muted">{choice.description}</span></span>
              {role===choice.value && <Check className="size-5 text-primary" aria-hidden />}
            </button>)}
        </div>
        {role==="doctor" && <p className="mt-3 text-xs text-muted">Votre compte médecin restera en attente de vérification jusqu'au dépôt et à la validation des justificatifs professionnels.</p>}
        {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <button type="button" disabled={!role || pending} onClick={() => void complete()}
          className="mt-6 h-12 w-full rounded-xl bg-primary font-bold text-white disabled:opacity-50">
          {pending ? "Création du profil…" : "Créer mon espace"}
        </button>
      </div>
    </div>}
  </>;
}
