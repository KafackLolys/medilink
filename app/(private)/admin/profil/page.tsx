"use client";

import { useAuthSession } from "@/hooks/use-auth-session";
import { authService } from "@/services/auth-service";
import { authStore } from "@/store/auth-store";
import { Check, UserRound, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function AdminProfilePage() {
  const session = useAuthSession();
  const user = session?.user;
  const [draft, setDraft] = useState<{ id: string; firstName: string; lastName: string; phone: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!user || user.role !== "admin") {
    return <p role="status" className="rounded-2xl bg-white p-6 text-muted">Chargement de votre profil administrateur…</p>;
  }
  const values = draft?.id === user.id
    ? draft
    : { id: user.id, firstName: user.firstName ?? "", lastName: user.lastName ?? "", phone: user.phone ?? "" };
  const update = (key: "firstName" | "lastName" | "phone", value: string) => {
    setDraft({ ...values, [key]: value });
    setNotice(null);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await authService.updateAdminProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim(),
      });
      authStore.setState((state) => ({
        session: state.session?.user.id === response.user.id
          ? { ...state.session, user: { ...state.session.user, ...response.user } }
          : state.session,
      }));
      setDraft(null);
      setNotice("Votre profil a été mis à jour.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de modifier votre profil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary"><ShieldCheck className="size-4" /> Administration</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-night">Mon profil</h1>
        <p className="mt-2 text-muted">Mettez à jour vos coordonnées personnelles. Les droits administrateur restent inchangés.</p>
      </header>
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><UserRound className="size-7" /></span>
          <div><h2 className="text-lg font-bold text-ink">Informations du compte</h2><p className="text-sm text-muted">Administrateur MediLink</p></div>
        </div>
        {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {notice && <p role="status" className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"><Check className="size-4" />{notice}</p>}
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold text-ink">Prénom
            <input required maxLength={80} autoComplete="given-name" value={values.firstName} onChange={(e) => update("firstName", e.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 font-normal focus:border-primary focus:outline-none" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">Nom
            <input required maxLength={80} autoComplete="family-name" value={values.lastName} onChange={(e) => update("lastName", e.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 font-normal focus:border-primary focus:outline-none" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink sm:col-span-2">Téléphone
            <input required type="tel" maxLength={30} autoComplete="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 font-normal focus:border-primary focus:outline-none" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-muted sm:col-span-2">Adresse e-mail (non modifiable ici)
            <input readOnly value={user.email ?? ""} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 font-normal" />
          </label>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button type="button" disabled={saving} onClick={() => { setDraft(null); setError(null); setNotice(null); }} className="h-11 rounded-xl border border-slate-200 px-5 font-semibold text-ink disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-bold text-white disabled:opacity-50"><Check className="size-4" />{saving ? "Enregistrement…" : "Enregistrer les modifications"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
