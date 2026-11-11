"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { Bell, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";

const INITIAL_SETTINGS = [
  { id: "new-needs", title: "Nouvelles demandes pertinentes", description: "Être averti des besoins correspondant à ma spécialité et ma zone.", enabled: true },
  { id: "appointments", title: "Rendez-vous et changements", description: "Recevoir les confirmations, annulations et rappels.", enabled: true },
  { id: "messages", title: "Nouveaux messages", description: "Recevoir une notification à chaque message d’un patient.", enabled: true },
  { id: "newsletter", title: "Conseils et actualités MedLink", description: "Recevoir occasionnellement des informations sur la plateforme.", enabled: false },
];

export default function DoctorSettingsPage() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <DoctorPageHeading title="Paramètres et sécurité" description="Gérez vos notifications et les réglages de sécurité de votre compte." />
      {saved && <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><Check className="size-4" aria-hidden />Préférences enregistrées.</p>}
      <section className={`${doctorCard} p-4 sm:p-5`}>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-night"><Bell className="size-5 text-primary" aria-hidden />Notifications</h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {settings.map((setting) => <li key={setting.id} className="flex items-center gap-3 py-4">
            <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-ink">{setting.title}</span><span className="mt-0.5 block text-xs leading-5 text-muted">{setting.description}</span></span>
            <button type="button" role="switch" aria-checked={setting.enabled} aria-label={setting.title} onClick={() => { setSettings((items) => items.map((item) => item.id === setting.id ? { ...item, enabled: !item.enabled } : item)); setSaved(false); }} className={`relative h-6 w-11 shrink-0 rounded-full transition ${setting.enabled ? "bg-primary" : "bg-slate-300"}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${setting.enabled ? "left-6" : "left-1"}`} /></button>
          </li>)}
        </ul>
      </section>
      <section className={`${doctorCard} p-4 sm:p-5`}>
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-night"><LockKeyhole className="size-5 text-primary" aria-hidden />Sécurité du compte</h2>
        <div className="mt-3 rounded-xl bg-slate-50 p-4"><p className="text-sm font-bold text-ink">Mot de passe</p><p className="mt-1 text-xs text-muted">Mettez régulièrement à jour votre mot de passe pour protéger votre compte.</p><button type="button" className="mt-3 h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-ink hover:border-primary hover:text-primary">Modifier mon mot de passe</button></div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />Ne partagez jamais vos identifiants. MedLink ne vous demandera pas votre mot de passe par message.</p>
      </section>
      <div className="flex justify-end"><button type="button" onClick={() => setSaved(true)} className="h-11 w-full rounded-xl bg-primary px-6 text-sm font-bold text-white hover:bg-blue-700 sm:w-auto">Enregistrer les préférences</button></div>
    </div>
  );
}
