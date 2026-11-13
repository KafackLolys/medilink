"use client";

import { useDoctor } from "@/hooks/use-doctor";
import { DoctorRatingSection } from "./doctor-rating-section";
import { ArrowLeft, BadgeCheck, CalendarDays, MapPin, Star, Video } from "lucide-react";
import Link from "next/link";

const modes = {
  home: "À domicile",
  teleconsultation: "Téléconsultation",
} as const;

const days: Record<string, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export default function DoctorProfileClient({ id }: { id: string }) {
  const { doctor, loading, error } = useDoctor(id);

  if (loading) {
    return <div role="status" className="rounded-3xl bg-white p-8 text-center text-muted">Chargement du profil…</div>;
  }
  if (!doctor || error) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-night">{error ?? "Ce médecin est introuvable."}</h1>
        <Link href="/patient/medecins" className="mt-4 inline-flex text-primary hover:underline">Retour à la recherche</Link>
      </div>
    );
  }

  const initials = doctor.name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/patient/medecins" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Trouver un médecin
      </Link>
      <article className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid size-24 shrink-0 place-items-center rounded-3xl bg-primary/10 text-3xl font-extrabold text-primary">{initials}</span>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                <BadgeCheck className="size-4" aria-hidden /> Médecin vérifié
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-night">{doctor.name}</h1>
              <p className="mt-1 text-lg text-muted">{doctor.specialty}</p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted"><Star className="size-4 fill-warn text-warn" aria-hidden />Avis des patients</p>
              <p className="mt-2 font-bold text-ink">
                {doctor.rating === null ? "Pas encore d’avis" : `${doctor.rating.toFixed(1).replace(".", ",")} / 5`}
                {doctor.rating !== null && <span className="font-normal text-muted"> · {doctor.reviewsCount} avis</span>}
              </p>
            </div>
            <div className="rounded-2xl bg-surface p-4">
              <p className="text-sm font-semibold text-muted">Expérience</p>
              <p className="mt-2 font-bold text-ink">{doctor.yearsOfExperience} ans de pratique</p>
            </div>
            <div className="rounded-2xl bg-surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted"><MapPin className="size-4 text-primary" aria-hidden />Secteur professionnel</p>
              <p className="mt-2 font-bold text-ink">{doctor.professionalAddress ?? "Non renseigné"}</p>
            </div>
            <div className="rounded-2xl bg-surface p-4">
              <p className="text-sm font-semibold text-muted">Tarif indicatif</p>
              <p className="mt-2 font-bold text-ink">{doctor.consultationFee.toLocaleString("fr-FR")} {doctor.currency}</p>
            </div>
          </div>
          {doctor.bio && (
            <section className="mt-5">
              <h2 className="font-bold text-ink">À propos</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{doctor.bio}</p>
            </section>
          )}
          <section className="mt-5">
            <h2 className="font-bold text-ink">Types de consultation</h2>
            {doctor.modes.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {doctor.modes.map((mode) => (
                  <li key={mode} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                    {mode === "teleconsultation" && <Video className="size-4" aria-hidden />}
                    {modes[mode]}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-2 text-sm text-muted">Aucun mode de consultation n’est renseigné.</p>}
          </section>
          <section className="mt-5">
            <h2 className="font-bold text-ink">Disponibilités hebdomadaires</h2>
            {doctor.availability.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {doctor.availability.map((slot) => (
                  <li key={`${slot.weekday}-${slot.startTime}`} className="flex items-center gap-2 text-sm text-muted">
                    <CalendarDays className="size-4 text-primary" aria-hidden />
                    {days[slot.weekday] ?? slot.weekday} · {slot.startTime}–{slot.endTime}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-2 text-sm text-muted">Aucune plage horaire n’est renseignée.</p>}
          </section>
          {doctor.modes.length > 0 && doctor.availability.length > 0 ? (
            <Link href={`/patient/medecins/${doctor.id}/rendez-vous`} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white sm:w-auto">
              <CalendarDays className="size-5" aria-hidden /> Prendre rendez-vous
            </Link>
          ) : (
            <button type="button" disabled className="mt-7 inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-400 px-6 font-semibold text-white sm:w-auto">
              <CalendarDays className="size-5" aria-hidden /> Rendez-vous indisponible
            </button>
          )}
        </div>
      </article>
      <DoctorRatingSection doctorId={doctor.id} />
    </div>
  );
}
