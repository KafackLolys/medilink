"use client";
import { integrationService } from "@/services/integration-service";

import { LiveMedicalSections } from "./components/live-medical-sections";

import {
  PATIENT_PROFILE_NAV,
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
import { useEffect, useState, type FormEvent } from "react";
import { usePatientProfile } from "@/hooks/use-patient-profile";
import { useNotifications } from "@/hooks/use-notifications";
import type { PatientProfileResponse } from "@/services/auth-service";
import { useNotificationStore } from "@/store/notification-store";
import { PatientMessagesContent } from "./components/message-content";
import { PatientDocumentsManager } from "./components/patient-documents-content";

const card =
  "rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:rounded-3xl";
type EditableProfileField =
  | "name"
  | "phone"
  | "location"
  | "bloodType";
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
  const dateOfBirth = patient.dateOfBirth
    ? new Date(patient.dateOfBirth)
    : null;
  const age = dateOfBirth
    ? Math.max(
        0,
        new Date().getFullYear() -
          dateOfBirth.getFullYear() -
          (new Date() <
          new Date(
            new Date().getFullYear(),
            dateOfBirth.getMonth(),
            dateOfBirth.getDate(),
          )
            ? 1
            : 0),
      )
    : null;
  const bloodTypes: Record<
    PatientProfileResponse["patient"]["bloodType"],
    string
  > = {
    a_positive: "A+",
    a_negative: "A-",
    b_positive: "B+",
    b_negative: "B-",
    ab_positive: "AB+",
    ab_negative: "AB-",
    o_positive: "O+",
    o_negative: "O-",
    unknown: "Inconnu",
  };
  const genders: Record<PatientProfileResponse["patient"]["gender"], string> = {
    female: "Femme",
    male: "Homme",
    non_binary: "Non binaire",
    undisclosed: "Non renseigné",
  };

  return {
    name: patient.fullName?.trim() || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Patient",
    initials: (patient.fullName?.trim() || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Patient")
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    age,
    gender: genders[patient.gender],
    bloodType: bloodTypes[patient.bloodType],
    location: patient.address
      ? `${patient.address.city}, ${patient.address.district}`
      : "Localisation non renseignée",
    phone: user.phone ?? "",
    email: user.email ?? "",
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

const healthIcons = {
  heart: Heart,
  droplet: Droplet,
  lungs: Wind,
} as const;

function ProfileSidebar({
  activeContent,
  setActiveContent,
}: {
  activeContent: "profil" | "messages" | "documents";
  setActiveContent: (content: "profil" | "messages" | "documents") => void;
}) {
  const unreadMessagesCount = useNotificationStore(
    (state) => state.unreadMessagesCount,
  );

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="Navigation du profil"
        className={`${card} sticky top-28 p-3`}
      >
        <ul className="space-y-1">
          {PATIENT_PROFILE_NAV.map((item, index) => {
            const Icon = navIcons[item.icon];
            return (
              <li
                key={item.id}
                className={
                  index === 3 ? "mt-3 border-t border-slate-100 pt-3" : ""
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveContent(
                      item.id as "profil" | "messages" | "documents",
                    )
                  }
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${activeContent === item.id ? "bg-blue-50 text-primary" : "text-ink hover:bg-slate-50"}`}
                >
                  <Icon
                    className={`size-5 ${activeContent === item.id ? "text-primary" : "text-slate-500"}`}
                    aria-hidden
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.id === "messages" ? (
                    unreadMessagesCount > 0 ? (
                      <span className="grid size-5 place-items-center rounded-full bg-danger text-xs font-bold text-white">
                        {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                      </span>
                    ) : null
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        <div
          id="support"
          className="mt-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center"
        >
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-white text-primary shadow-sm">
            <Stethoscope className="size-5" aria-hidden />
          </span>
          <h2 className="mt-2 text-sm font-bold text-night">Besoin d’aide ?</h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Notre équipe vous accompagne 7j/7.
          </p>
          <a
            href="/contact"
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold text-ink shadow-sm hover:text-primary"
          >
            <CircleHelp className="size-4" aria-hidden /> Contacter le support
          </a>
        </div>
      </nav>
    </aside>
  );
}

export default function PatientProfilePage() {
  useNotifications(20, true);
  const { profile: apiProfile, loading, error, reload } = usePatientProfile();
  const [editedProfile, setEditedProfile] = useState<ProfileView | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);

  const [activeContent, setActiveContent] = useState<
    "profil" | "messages" | "documents"
  >("profil");

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("activeContent");
    if (tab === "documents" || tab === "messages" || tab === "profil") {
      void Promise.resolve().then(() => setActiveContent(tab));
    }
  }, []);

  function updateProfile(key: EditableProfileField, value: string) {
    if (!apiProfile) return;
    setEditedProfile((current) => ({
      ...(current ?? toProfileView(apiProfile)),
      [key]: value,
    }));
    setSaved(false);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!apiProfile) return;
    const profile = editedProfile ?? toProfileView(apiProfile);
    setProfileSaveError(null);
    setSavingProfile(true);
    try {
      const bloodType = ({"A+":"a_positive", "A-":"a_negative", "B+":"b_positive", "B-":"b_negative", "AB+":"ab_positive", "AB-":"ab_negative", "O+":"o_positive", "O-":"o_negative", "Inconnu":"unknown"} as Record<string,string>)[profile.bloodType];
      const pieces = (profile.location === "Localisation non renseignée" ? "" : profile.location).split(",");
      await integrationService.savePatientProfile({
        name:profile.name, phone:profile.phone, bloodType: bloodType ?? "unknown",
        city:pieces[0]?.trim() ?? "", district:pieces.slice(1).join(",").trim(),
      });
      setEditing(false);
      setEditedProfile(null);
      setSaved(true);
      reload();
    } catch (cause) {
      setProfileSaveError(cause instanceof Error ? cause.message : "Impossible d'enregistrer le profil.");
      setSaved(false);
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading && !apiProfile) {
    return <div role="status" className={`${card} mx-auto max-w-xl p-6 text-center text-muted`}>Chargement de votre profil…</div>;
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
  const profile = editedProfile ?? toProfileView(apiProfile);

  return (
    <div className="grid gap-5 lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-6">
      <ProfileSidebar
        activeContent={activeContent}
        setActiveContent={setActiveContent}
      />

      {activeContent === "messages" ? (
        <PatientMessagesContent />
      ) : activeContent === "documents" ? (
        <PatientDocumentsManager />
      ) : loading ? (
        <p
          role="status"
          className={`${card} p-6 text-center text-sm font-semibold text-muted`}
        >
          Chargement de votre profil…
        </p>
      ) : (error || !apiProfile) && !loading ? (
        <section className={`${card} mx-auto max-w-xl p-6 text-center`}>
          <h1 className="text-xl font-extrabold text-night">
            Profil indisponible
          </h1>
          <p role="alert" className="mt-2 text-sm text-muted">
            {error ?? "Aucune information de profil n’a été retournée."}
          </p>
          <button
            type="button"
            onClick={reload}
            className="mt-4 h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white"
          >
            Réessayer
          </button>
        </section>
      ) : (
        <div id="overview" className="min-w-0 space-y-4 sm:space-y-5">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-night sm:text-3xl">
                Mon profil
              </h1>
              <p className="mt-1 text-sm text-muted sm:text-base">
                Gérez vos informations personnelles et votre dossier de santé.
              </p>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setSaved(false);
                }}
                className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-primary/30 bg-white px-4 text-sm font-bold text-primary transition hover:bg-blue-50 sm:self-auto"
              >
                <Activity className="size-4" aria-hidden /> Modifier le profil
              </button>
            )}
          </header>

          {saved && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
            >
              <Check className="size-4" aria-hidden /> Vos informations ont été
              mises à jour.
            </p>
          )}

          {profileSaveError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{profileSaveError}</p>}
          {editing ? (
            <form onSubmit={saveProfile} className={`${card} p-4 sm:p-6`}>
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-night">
                  Modifier mes informations
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Vos informations personnelles restent privées.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-ink">
                  Nom complet
                  <input
                    required
                    value={profile.name}
                    onChange={(event) =>
                      updateProfile("name", event.target.value)
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>
                <label className="text-sm font-semibold text-ink">
                  Téléphone
                  <input
                    required
                    type="tel"
                    value={profile.phone}
                    onChange={(event) =>
                      updateProfile("phone", event.target.value)
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>
                <label className="text-sm font-semibold text-ink">
                  Adresse e-mail
                  <input
                    required
                    type="email"
                    value={profile.email}
                    disabled
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>
                <label className="text-sm font-semibold text-ink">
                  Ville et quartier
                  <input
                    value={profile.location === "Localisation non renseignée" ? "" : profile.location}
                    onChange={(event) =>
                      updateProfile("location", event.target.value)
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>
                <label className="text-sm font-semibold text-ink">
                  Groupe sanguin
                  <select
                    value={profile.bloodType}
                    onChange={(event) =>
                      updateProfile("bloodType", event.target.value)
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    {[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                      "Inconnu",
                    ].map((group) => (
                      <option key={group}>{group}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEditedProfile(null);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-5 text-sm font-bold text-ink hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-blue-700"
                >
                  <Check className="size-4" aria-hidden /> Enregistrer les
                  modifications
                </button>
              </div>
            </form>
          ) : (
            <section
              className={`${card} relative overflow-hidden bg-gradient-to-r from-white via-white to-blue-50 p-4 sm:p-5`}
              aria-label="Informations personnelles"
            >
              <HeartPulse
                className="absolute -right-2 top-1/2 size-28 -translate-y-1/2 text-primary/10 sm:right-6 sm:size-36"
                aria-hidden
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="grid size-24 shrink-0 place-items-center self-center rounded-2xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 text-primary sm:size-32 sm:self-auto">
                  <UserRound
                    className="size-14 sm:size-20"
                    strokeWidth={1.3}
                    aria-label={`Avatar de ${profile.name}`}
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h2 className="text-xl font-extrabold tracking-tight text-night sm:text-2xl">
                      {profile.name}
                    </h2>
                    {profile.verified && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        <ShieldCheck className="size-4" aria-hidden /> Patient
                        vérifié
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-ink sm:justify-start">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays
                        className="size-4 text-primary"
                        aria-hidden
                      />
                      {profile.age === null
                        ? "Âge non renseigné"
                        : `${profile.age} ans`}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Venus className="size-4 text-primary" aria-hidden />
                      {profile.gender}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Droplet className="size-4 text-danger" aria-hidden />
                      Groupe {profile.bloodType}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
                    <span className="inline-flex min-w-0 items-center justify-center gap-2 sm:justify-start">
                      <MapPin
                        className="size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <span className="truncate">{profile.location}</span>
                    </span>
                    <a
                      href={`tel:${profile.phone.replaceAll(" ", "")}`}
                      className="inline-flex min-w-0 items-center justify-center gap-2 hover:text-primary sm:justify-start"
                    >
                      <Phone
                        className="size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      {profile.phone}
                    </a>
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex min-w-0 items-center justify-center gap-2 hover:text-primary sm:col-span-2 sm:justify-start"
                    >
                      <Mail
                        className="size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <span className="truncate">{profile.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          <LiveMedicalSections openDocuments={() => setActiveContent("documents")} />

          <section
            id="settings"
            className="scroll-mt-28 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 sm:px-5"
            aria-label="Rappel de sécurité"
          >
            <p className="flex items-start gap-2 text-xs leading-5 text-night sm:text-sm">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              Vos informations de santé sont personnelles. En cas d’urgence
              médicale, contactez immédiatement les services d’urgence.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
