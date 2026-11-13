import { BadgeCheck, CalendarDays, MapPin, Star } from "lucide-react";
import Link from "next/link";
import type { DoctorDirectoryItem } from "@/services/doctor-service";
import { nextBookableWindow } from "@/lib/doctor-bookability";

const modeLabels = {
  home: "À domicile",
  teleconsultation: "Téléconsultation",
} as const;

const colors = [
  "bg-secondary/15 text-secondary",
  "bg-primary/10 text-primary",
  "bg-warn/20 text-amber-700",
];

export function DoctorCard({ doctor }: { doctor: DoctorDirectoryItem }) {
  const initials = doctor.name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
  const nextSlot = nextBookableWindow(doctor);

  return (
    <article className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]">
      <div className="flex items-start gap-4">
        <span className={`grid size-16 shrink-0 place-items-center rounded-2xl text-xl font-bold ${colors[doctor.name.length % colors.length]}`}>
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-ink">{doctor.name}</h2>
          <p className="text-[15px] text-muted">{doctor.specialty}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-success">
            <BadgeCheck className="size-4" aria-hidden /> Médecin vérifié
          </p>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-muted">
        <span className="inline-flex items-center gap-1 font-semibold text-ink">
          <Star className="size-4 fill-warn text-warn" aria-hidden />
          {doctor.rating === null ? "Nouveau profil" : `${doctor.rating.toFixed(1).replace(".", ",")} (${doctor.reviewsCount} avis)`}
        </span>
        <span>{doctor.yearsOfExperience} ans d’expérience</span>
      </p>
      <p className="mt-1.5 flex items-center gap-1.5 text-[15px] text-muted">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {doctor.professionalAddress ?? doctor.serviceCity ?? "Secteur non renseigné"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {nextSlot ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <CalendarDays className="size-3.5" aria-hidden />
            {nextSlot.label} · {nextSlot.startTime}–{nextSlot.endTime}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-muted">Aucun créneau proposé dans les 30 prochains jours</span>
        )}
        {doctor.modes.map((mode) => (
          <span key={mode} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
            {modeLabels[mode]}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link href={`/patient/medecins/${doctor.id}`} className="inline-flex h-11 items-center justify-center rounded-full bg-surface px-3 text-[15px] font-semibold text-ink hover:bg-slate-100">
          Voir le profil
        </Link>
        {nextSlot ? (
          <Link href={`/patient/medecins/${doctor.id}/rendez-vous`} className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-3 text-[15px] font-semibold text-white">
            Prendre rendez-vous
          </Link>
        ) : (
          <Link href={`/patient/medecins/${doctor.id}`} className="inline-flex h-11 items-center justify-center rounded-full bg-slate-100 px-3 text-[15px] font-semibold text-ink">
            Consulter le profil
          </Link>
        )}
      </div>
    </article>
  );
}
