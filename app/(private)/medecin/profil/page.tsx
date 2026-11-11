"use client";

import { doctorCard, DoctorPageHeading, SectionTitle } from "../../components/doctor-ui";
import { DOCTOR_PROFILE_DETAILS } from "@/lib/doctor-portal-data";
import { ArrowRight, BadgeCheck, BriefcaseMedical, Check, FileCheck2, FileUp, MapPin, Settings, ShieldCheck, Star, UserRound } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type ProfessionalProfile = {
  fullName: string;
  phone: string;
  email: string;
  specialty: string;
  secondarySpecialties: string;
  degrees: string;
  registrationNumber: string;
  experienceYears: string;
  bio: string;
  consultationFee: string;
  professionalAddress: string;
};

const INITIAL_PROFILE: ProfessionalProfile = {
  fullName: DOCTOR_PROFILE_DETAILS.fullName,
  phone: DOCTOR_PROFILE_DETAILS.phone,
  email: DOCTOR_PROFILE_DETAILS.email,
  specialty: DOCTOR_PROFILE_DETAILS.specialty,
  secondarySpecialties: DOCTOR_PROFILE_DETAILS.secondarySpecialties.join(", "),
  degrees: DOCTOR_PROFILE_DETAILS.degrees.join("\n"),
  registrationNumber: DOCTOR_PROFILE_DETAILS.registrationNumber,
  experienceYears: String(DOCTOR_PROFILE_DETAILS.experienceYears),
  bio: DOCTOR_PROFILE_DETAILS.bio,
  consultationFee: DOCTOR_PROFILE_DETAILS.consultationFee,
  professionalAddress: DOCTOR_PROFILE_DETAILS.professionalAddress,
};

const fieldClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function DoctorProfilePage() {
  const [form, setForm] = useState(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const set = (key: keyof ProfessionalProfile, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditing(false);
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <DoctorPageHeading
        title="Profil professionnel"
        description="Présentez votre expérience et les informations utiles aux patients."
        action={editing ? undefined : <button type="button" onClick={() => setEditing(true)} className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-primary/30 bg-white px-4 text-sm font-bold text-primary hover:bg-blue-50"><UserRound className="size-4" aria-hidden />Modifier mon profil</button>}
      />
      {saved && <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><Check className="size-4" aria-hidden />Profil enregistré localement.</p>}

      <div className={`${doctorCard} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5`}>
        <span className="grid size-16 shrink-0 place-items-center self-center rounded-2xl bg-blue-50 text-primary sm:size-20 sm:self-auto"><UserRound className="size-10" aria-hidden /></span>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-night">{form.fullName}</h2>
          <p className="mt-1 text-sm text-muted">{form.specialty} · {form.experienceYears} ans d’expérience</p>
        </div>
        <span className="inline-flex items-center gap-2 self-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
          <ShieldCheck className="size-4" aria-hidden />{DOCTOR_PROFILE_DETAILS.verificationStatus}
        </span>
      </div>

      <form onSubmit={save} className="space-y-4">
        <section className={`${doctorCard} p-4 sm:p-5`}>
          <SectionTitle><><UserRound className="mr-2 inline size-5 text-primary" aria-hidden />Informations personnelles et professionnelles</></SectionTitle>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-ink">Nom complet<input required readOnly={!editing} value={form.fullName} onChange={(event) => set("fullName", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink">Téléphone<input required type="tel" readOnly={!editing} value={form.phone} onChange={(event) => set("phone", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink">Adresse e-mail<input required type="email" readOnly={!editing} value={form.email} onChange={(event) => set("email", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink">Spécialité principale<input required readOnly={!editing} value={form.specialty} onChange={(event) => set("specialty", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink sm:col-span-2">Spécialités secondaires<input readOnly={!editing} value={form.secondarySpecialties} onChange={(event) => set("secondarySpecialties", event.target.value)} placeholder="Séparez les spécialités par des virgules" className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink">Années d’expérience<input required min="0" type="number" readOnly={!editing} value={form.experienceYears} onChange={(event) => set("experienceYears", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink">N° d’inscription professionnelle<input required readOnly={!editing} value={form.registrationNumber} onChange={(event) => set("registrationNumber", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink sm:col-span-2">Diplômes<textarea readOnly={!editing} value={form.degrees} onChange={(event) => set("degrees", event.target.value)} className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none focus:border-primary read-only:bg-slate-50" /></label>
            <label className="text-sm font-semibold text-ink sm:col-span-2">Présentation professionnelle<textarea readOnly={!editing} maxLength={600} value={form.bio} onChange={(event) => set("bio", event.target.value)} className="mt-1.5 min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none focus:border-primary read-only:bg-slate-50" /><span className="text-xs font-normal text-muted">{form.bio.length}/600 caractères</span></label>
          </div>
        </section>

        <section className={`${doctorCard} p-4 sm:p-5`}>
          <SectionTitle><><BriefcaseMedical className="mr-2 inline size-5 text-primary" aria-hidden />Consultation et zone d’intervention</></SectionTitle>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-ink">Tarif de consultation (FCFA)<input min="0" type="number" readOnly={!editing} value={form.consultationFee} onChange={(event) => set("consultationFee", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
            <label className="text-sm font-semibold text-ink">Adresse professionnelle<input readOnly={!editing} value={form.professionalAddress} onChange={(event) => set("professionalAddress", event.target.value)} className={`${fieldClass} read-only:bg-slate-50`} /></label>
          </div>
          <Link href="/medecin/zone-intervention" className="mt-4 inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-xl bg-blue-50 px-4 text-sm font-bold text-primary hover:bg-blue-100 sm:w-auto sm:min-w-72">
            <span className="inline-flex items-center gap-2"><MapPin className="size-4" aria-hidden />Gérer les zones couvertes</span><ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>

        <section className={`${doctorCard} p-4 sm:p-5`}>
          <SectionTitle><><FileCheck2 className="mr-2 inline size-5 text-primary" aria-hidden />Documents justificatifs</></SectionTitle>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {DOCTOR_PROFILE_DETAILS.documents.map((document) => (
              <li key={document.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
                <FileCheck2 className="size-5 shrink-0 text-emerald-600" aria-hidden />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-ink">{document.name}</span><span className="block truncate text-xs text-muted">{document.filename}</span></span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">{document.status}</span>
              </li>
            ))}
            {uploadedFiles.map((name) => <li key={name} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3"><FileCheck2 className="size-5 shrink-0 text-primary" aria-hidden /><span className="truncate text-sm font-semibold text-ink">{name}</span></li>)}
          </ul>
          {editing && <label className="mt-3 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary/50 px-4 text-sm font-semibold text-primary hover:bg-blue-50"><FileUp className="size-4" aria-hidden />Ajouter un justificatif<input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="sr-only" onChange={(event) => setUploadedFiles((files) => [...files, ...Array.from(event.target.files ?? []).map((file) => file.name)])} /></label>}
          <p className="mt-2 text-xs text-muted">Formats acceptés : PDF, JPG ou PNG. La vérification est réalisée par l’équipe MedLink.</p>
        </section>

        <section className={`${doctorCard} p-4 sm:p-5`}>
          <SectionTitle><><BadgeCheck className="mr-2 inline size-5 text-primary" aria-hidden />Historique et réputation</></SectionTitle>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-extrabold text-night">4,9/5</p><p className="text-xs text-muted">Note moyenne des patients</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-extrabold text-night">38</p><p className="text-xs text-muted">Consultations terminées</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-extrabold text-night">14 ans</p><p className="text-xs text-muted">Expérience professionnelle</p></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            <Link href="/medecin/historique" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Historique des consultations <ArrowRight className="size-4" aria-hidden /></Link>
            <Link href="/medecin/avis" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"><Star className="size-4" aria-hidden />Avis des patients</Link>
            <Link href="/medecin/parametres" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"><Settings className="size-4" aria-hidden />Paramètres et sécurité</Link>
          </div>
        </section>

        {editing && <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => { setForm(INITIAL_PROFILE); setEditing(false); }} className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-bold text-ink">Annuler</button><button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white"><Check className="size-4" aria-hidden />Enregistrer le profil</button></div>}
      </form>
    </div>
  );
}
