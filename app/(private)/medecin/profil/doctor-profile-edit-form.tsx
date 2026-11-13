"use client";

import { useState, type FormEvent } from "react";
import { doctorService, type DoctorOwnProfile } from "@/services/doctor-service";

export function DoctorProfileEditForm({ profile, onSaved }: { profile: DoctorOwnProfile; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);
  const [yearsOfExperience, setYears] = useState(String(profile.yearsOfExperience));
  const [consultationFee, setFee] = useState(String(profile.consultationFee));
  const [professionalAddress, setAddress] = useState(profile.professionalAddress ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(null); setSuccess(false);
    try {
      await doctorService.updateMyProfile({
        bio: bio.trim(), yearsOfExperience: Number(yearsOfExperience),
        consultationFee: Number(consultationFee), professionalAddress: professionalAddress.trim() || null,
      });
      setSuccess(true); setEditing(false); onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Enregistrement impossible.");
    } finally {setSaving(false);}
  }
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-extrabold text-night">Modifier mes informations professionnelles</h2><button type="button" onClick={()=>{setEditing(!editing);setError(null);}} className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-primary">{editing ? "Annuler" : "Modifier"}</button></div>
    {success && <p role="status" className="mt-3 text-sm text-emerald-700">Profil mis à jour sur le serveur.</p>}
    {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
    <p className="mt-2 text-xs text-muted">Votre identité, vos diplômes, votre numéro d&apos;inscription et votre statut de vérification ne sont pas modifiables ici.</p>
    {editing && <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
      <label className="text-sm font-semibold text-ink sm:col-span-2">Présentation professionnelle<textarea rows={4} maxLength={600} required value={bio} onChange={e=>setBio(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal"/></label>
      <label className="text-sm font-semibold text-ink">Années d&apos;expérience<input type="number" min="0" max="80" required value={yearsOfExperience} onChange={e=>setYears(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3"/></label>
      <label className="text-sm font-semibold text-ink">Tarif ({profile.currency})<input type="number" min="0" max="100000000" step="1" required value={consultationFee} onChange={e=>setFee(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3"/></label>
      <label className="text-sm font-semibold text-ink sm:col-span-2">Adresse professionnelle<input maxLength={255} value={professionalAddress} onChange={e=>setAddress(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3"/></label>
      <button type="submit" disabled={saving} className="h-11 rounded-xl bg-primary px-5 font-bold text-white disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer les modifications"}</button>
    </form>}
  </section>;
}
