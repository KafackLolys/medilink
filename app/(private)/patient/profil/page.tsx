"use client";

import {
  PATIENT_HEALTH,
  PATIENT_PROFILE,
  PATIENT_PROFILE_APPOINTMENT,
  PATIENT_PROFILE_DOCUMENTS,
  PATIENT_PROFILE_MESSAGES,
  PATIENT_PROFILE_NAV,
  PATIENT_PROFILE_REQUEST,
} from "@/lib/patient-profile-data";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Droplet,
  FileText,
  Folder,
  Heart,
  HeartPulse,
  House,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Venus,
  Wind,
} from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { usePatientProfile } from "@/hooks/use-patient-profile";
import type { PatientProfileResponse } from "@/services/auth-service";
import { PatientMessagesContent } from "./components/message-content";

const card = "rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:rounded-3xl";
type EditableProfileField = "name" | "phone" | "email" | "location" | "bloodType";
type ProfileView = {
  name: string;
  initials: string;
  age: number | null;
  gender: string;
  bloodType: string;
  location: string;
  phone: string;
  email: string;
  verified: boolean;
};

function toProfileView(data: PatientProfileResponse): ProfileView {
  const { user, patient } = data;
  const dateOfBirth = patient.dateOfBirth ? new Date(patient.dateOfBirth) : null;
  const age = dateOfBirth
    ? Math.max(0, new Date().getFullYear() - dateOfBirth.getFullYear() - (
      new Date() < new Date(new Date().getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate()) ? 1 : 0
    ))
    : null;
  const bloodTypes: Record<PatientProfileResponse["patient"]["bloodType"], string> = {
    a_positive: "A+", a_negative: "A-", b_positive: "B+", b_negative: "B-",
    ab_positive: "AB+", ab_negative: "AB-", o_positive: "O+", o_negative: "O-", unknown: "Inconnu",
  };
  const genders: Record<PatientProfileResponse["patient"]["gender"], string> = {
    female: "Femme", male: "Homme", non_binary: "Non binaire", undisclosed: "Non renseigné",
  };

  return {
    name: patient.fullName,
    initials: patient.fullName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    age,
    gender: genders[patient.gender],
    bloodType: bloodTypes[patient.bloodType],
    location: patient.address ? `${patient.address.city}, ${patient.address.district}` : "Localisation non renseignée",
    phone: user.phone,
    email: user.email,
    verified: patient.verified,
  };
}

const navIcons = {
  user: UserRound,
  message: MessageCircle,
  folder: Folder,
  settings: Settings,
  help: CircleHelp,
} as const;

const tabIcons = {
  home: House,
  folder: Folder,
  calendar: CalendarDays,
  file: FileText,
  message: MessageCircle,
} as const;

const healthIcons = {
  heart: Heart,
  droplet: Droplet,
  lungs: Wind,
} as const;

function ProfileSidebar(
  { activeContent, setActiveContent }:
    {
      activeContent: "profil" | "messages" | "documents";
      setActiveContent: (content: "profil" | "messages" | "documents") => void
    }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label="Navigation du profil" className={`${card} sticky top-28 p-3`}>
        <ul className="space-y-1">
          {PATIENT_PROFILE_NAV.map((item, index) => {
            const Icon = navIcons[item.icon];
            return (
              <li key={item.id} className={index === 3 ? "mt-3 border-t border-slate-100 pt-3" : ""}>
                <button
                  type="button"
                  onClick={() => setActiveContent(item.id as "profil" | "messages" | "documents")}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${activeContent === item.id ? "bg-blue-50 text-primary" : "text-ink hover:bg-slate-50"}`}
                >
                  <Icon className={`size-5 ${activeContent === item.id ? "text-primary" : "text-slate-500"}`} aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && item.badge ? (
                    <span className="grid size-5 place-items-center rounded-full bg-danger text-xs font-bold text-white">{item.badge}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        <div id="support" className="mt-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-white text-primary shadow-sm">
            <Stethoscope className="size-5" aria-hidden />
          </span>
          <h2 className="mt-2 text-sm font-bold text-night">Besoin d’aide ?</h2>
          <p className="mt-1 text-xs leading-5 text-muted">Notre équipe vous accompagne 7j/7.</p>
          <a href="/contact" className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold text-ink shadow-sm hover:text-primary">
            <CircleHelp className="size-4" aria-hidden /> Contacter le support
          </a>
        </div>
      </nav>
    </aside>
  );
}

export default function PatientProfilePage() {
  const { profile: apiProfile, loading, error, reload } = usePatientProfile();
  const [editedProfile, setEditedProfile] = useState<ProfileView | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const baseProfile: ProfileView = apiProfile ? toProfileView(apiProfile) : PATIENT_PROFILE;
  const profile = editedProfile ?? baseProfile;

  const [activeContent, setActiveContent] = useState<"profil" | "messages" | "documents">("profil");

  function updateProfile(key: EditableProfileField, value: string) {
    setEditedProfile((current) => ({ ...(current ?? baseProfile), [key]: value }));
    setSaved(false);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditing(false);
    setSaved(true);
  }

  if (error || !apiProfile) {
    return (
      <section className={`${card} mx-auto max-w-xl p-6 text-center`}>
        <h1 className="text-xl font-extrabold text-night">Profil indisponible</h1>
        <p role="alert" className="mt-2 text-sm text-muted">{error ?? "Aucune information de profil n’a été retournée."}</p>
        <button type="button" onClick={reload} className="mt-4 h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white">Réessayer</button>
      </section>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-6">
      <ProfileSidebar activeContent={activeContent} setActiveContent={setActiveContent} />

      {activeContent === "messages" ? (<PatientMessagesContent />) :
        activeContent === "documents" ? (<p>: Documents</p>) :
          loading ? (<p role="status" className={`${card} p-6 text-center text-sm font-semibold text-muted`}>Chargement de votre profil…</p>) :
            (error || !apiProfile) ?
              (<section className={`${card} mx-auto max-w-xl p-6 text-center`}>
                <h1 className="text-xl font-extrabold text-night">Profil indisponible</h1>
                <p role="alert" className="mt-2 text-sm text-muted">{error ?? "Aucune information de profil n’a été retournée."}</p>
                <button type="button" onClick={reload} className="mt-4 h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white">Réessayer</button>
              </section>)
              :
              (
                <div id="overview" className="min-w-0 space-y-4 sm:space-y-5">
                  <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-extrabold tracking-tight text-night sm:text-3xl">Mon profil</h1>
                      <p className="mt-1 text-sm text-muted sm:text-base">Gérez vos informations personnelles et votre dossier de santé.</p>
                    </div>
                    {!editing && (
                      <button
                        type="button"
                        onClick={() => { setEditing(true); setSaved(false); }}
                        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-primary/30 bg-white px-4 text-sm font-bold text-primary transition hover:bg-blue-50 sm:self-auto"
                      >
                        <Activity className="size-4" aria-hidden /> Modifier le profil
                      </button>
                    )}
                  </header>

                  {saved && (
                    <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      <Check className="size-4" aria-hidden /> Vos informations ont été mises à jour.
                    </p>
                  )}

                  {editing ? (
                    <form onSubmit={saveProfile} className={`${card} p-4 sm:p-6`}>
                      <div className="mb-5">
                        <h2 className="text-lg font-extrabold text-night">Modifier mes informations</h2>
                        <p className="mt-1 text-sm text-muted">Vos informations personnelles restent privées.</p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-semibold text-ink">
                          Nom complet
                          <input required value={profile.name} onChange={(event) => updateProfile("name", event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
                        </label>
                        <label className="text-sm font-semibold text-ink">
                          Téléphone
                          <input required type="tel" value={profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
                        </label>
                        <label className="text-sm font-semibold text-ink">
                          Adresse e-mail
                          <input required type="email" value={profile.email} onChange={(event) => updateProfile("email", event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
                        </label>
                        <label className="text-sm font-semibold text-ink">
                          Ville et quartier
                          <input required value={profile.location} onChange={(event) => updateProfile("location", event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
                        </label>
                        <label className="text-sm font-semibold text-ink">
                          Groupe sanguin
                          <select value={profile.bloodType} onChange={(event) => updateProfile("bloodType", event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Inconnu"].map((group) => <option key={group}>{group}</option>)}
                          </select>
                        </label>
                      </div>
                      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button type="button" onClick={() => { setEditing(false); setEditedProfile(null); }} className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-5 text-sm font-bold text-ink hover:bg-slate-200">Annuler</button>
                        <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-blue-700">
                          <Check className="size-4" aria-hidden /> Enregistrer les modifications
                        </button>
                      </div>
                    </form>
                  ) : (
                    <section className={`${card} relative overflow-hidden bg-gradient-to-r from-white via-white to-blue-50 p-4 sm:p-5`} aria-label="Informations personnelles">
                      <HeartPulse className="absolute -right-2 top-1/2 size-28 -translate-y-1/2 text-primary/10 sm:right-6 sm:size-36" aria-hidden />
                      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                        <div className="grid size-24 shrink-0 place-items-center self-center rounded-2xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 text-primary sm:size-32 sm:self-auto">
                          <UserRound className="size-14 sm:size-20" strokeWidth={1.3} aria-label={`Avatar de ${profile.name}`} />
                        </div>
                        <div className="min-w-0 flex-1 text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h2 className="text-xl font-extrabold tracking-tight text-night sm:text-2xl">{profile.name}</h2>
                            {profile.verified && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                <ShieldCheck className="size-4" aria-hidden /> Patient vérifié
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-ink sm:justify-start">
                            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-primary" aria-hidden />{profile.age === null ? "Âge non renseigné" : `${profile.age} ans`}</span>
                            <span className="inline-flex items-center gap-1.5"><Venus className="size-4 text-primary" aria-hidden />{profile.gender}</span>
                            <span className="inline-flex items-center gap-1.5"><Droplet className="size-4 text-danger" aria-hidden />Groupe {profile.bloodType}</span>
                          </div>
                          <div className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
                            <span className="inline-flex min-w-0 items-center justify-center gap-2 sm:justify-start"><MapPin className="size-4 shrink-0 text-primary" aria-hidden /><span className="truncate">{profile.location}</span></span>
                            <a href={`tel:${profile.phone.replaceAll(" ", "")}`} className="inline-flex min-w-0 items-center justify-center gap-2 hover:text-primary sm:justify-start"><Phone className="size-4 shrink-0 text-primary" aria-hidden />{profile.phone}</a>
                            <a href={`mailto:${profile.email}`} className="inline-flex min-w-0 items-center justify-center gap-2 hover:text-primary sm:col-span-2 sm:justify-start"><Mail className="size-4 shrink-0 text-primary" aria-hidden /><span className="truncate">{profile.email}</span></a>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  <section id="health-record" className={`${card} scroll-mt-28 p-4 sm:p-5`} aria-labelledby="health-title">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 id="health-title" className="flex items-center gap-2 text-lg font-extrabold text-night sm:text-xl">
                        <HeartPulse className="size-6 text-primary" aria-hidden /> Mon état de santé
                      </h2>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        <Activity className="size-3.5" aria-hidden /> Suivi régulier
                      </span>
                    </div>
                    <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
                      {PATIENT_HEALTH.map((condition) => {
                        const Icon = healthIcons[condition.icon];
                        return (
                          <li key={condition.id} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3.5">
                            <Icon className={`size-6 ${condition.tone === "red" ? "text-danger" : "text-primary"}`} aria-hidden />
                            <h3 className="mt-2 text-sm font-bold text-ink">{condition.name}</h3>
                            <p className="text-sm text-muted">{condition.status}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </section>

                  <section className={`${card} scroll-mt-28 p-4 sm:p-5`} aria-labelledby="appointments-title">
                    <div className="flex items-center justify-between gap-2">
                      <h2 id="appointments-title" className="flex items-center gap-2 text-lg font-extrabold text-night sm:text-xl">
                        <CalendarDays className="size-5 text-primary sm:size-6" aria-hidden /> Derniers rendez-vous
                      </h2>
                      <Link href="/patient/rendez-vous" className="shrink-0 text-sm font-bold text-primary hover:underline">Voir tout <ArrowRight className="inline size-4" aria-hidden /></Link>
                    </div>
                    <Link href={PATIENT_PROFILE_APPOINTMENT.href} className="mt-3 flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/40 sm:gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-center text-xs font-extrabold leading-tight text-primary sm:size-14 sm:text-sm">
                        <span>{PATIENT_PROFILE_APPOINTMENT.date.split(" ")[0]}<br />{PATIENT_PROFILE_APPOINTMENT.date.split(" ")[1]}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-night sm:text-base">{PATIENT_PROFILE_APPOINTMENT.title}</span>
                        <span className="block truncate text-xs text-muted sm:text-sm">{PATIENT_PROFILE_APPOINTMENT.doctor} · {PATIENT_PROFILE_APPOINTMENT.specialty}</span>
                      </span>
                      <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700 sm:inline-flex">
                        <Check className="size-4" aria-hidden />{PATIENT_PROFILE_APPOINTMENT.status}
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden />
                    </Link>
                  </section>

                  <section className={`${card} scroll-mt-28 p-4 sm:p-5`} aria-labelledby="requests-title">
                    <div className="flex items-center justify-between gap-2">
                      <h2 id="requests-title" className="flex items-center gap-2 text-lg font-extrabold text-night sm:text-xl">
                        <ClipboardList className="size-5 text-primary sm:size-6" aria-hidden /> Mes dernières demandes
                      </h2>
                      <Link href="/patient/demandes" className="shrink-0 text-sm font-bold text-primary hover:underline">Voir tout <ArrowRight className="inline size-4" aria-hidden /></Link>
                    </div>
                    <Link href={PATIENT_PROFILE_REQUEST.href} className="mt-3 flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/40 sm:gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600"><Stethoscope className="size-5" aria-hidden /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-night sm:text-base">{PATIENT_PROFILE_REQUEST.title}</span>
                        <span className="block truncate text-xs text-muted">{PATIENT_PROFILE_REQUEST.published} · {PATIENT_PROFILE_REQUEST.proposals} propositions reçues</span>
                      </span>
                      <span className="hidden shrink-0 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-bold text-primary sm:inline-flex">{PATIENT_PROFILE_REQUEST.status}</span>
                      <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden />
                    </Link>
                  </section>

                  <section id="settings" className="scroll-mt-28 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 sm:px-5" aria-label="Rappel de sécurité">
                    <p className="flex items-start gap-2 text-xs leading-5 text-night sm:text-sm">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      Vos informations de santé sont personnelles. En cas d’urgence médicale, contactez immédiatement les services d’urgence.
                    </p>
                  </section>
                </div>)}
    </div>
  );
}
