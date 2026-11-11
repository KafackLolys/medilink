import { DOCTORS } from "@/lib/doctors";
import { ArrowLeft, BadgeCheck, CalendarDays, MapPin, Star, Video } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return DOCTORS.map(({ id }) => ({ id }));
}

export default async function DoctorProfilePage({ params }: PageProps<"/patient/medecins/[id]">) {
  const { id } = await params;
  const doctor = DOCTORS.find((item) => item.id === id);
  if (!doctor) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/patient/medecins" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden />Trouver un médecin</Link>
      <article className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className={`grid size-24 shrink-0 place-items-center rounded-3xl text-3xl font-extrabold ${doctor.color}`}>{doctor.initials}</span>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700"><BadgeCheck className="size-4" aria-hidden />Médecin vérifié</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-night">{doctor.name}</h1>
              <p className="mt-1 text-lg text-muted">{doctor.specialty}</p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface p-4"><p className="flex items-center gap-2 text-sm font-semibold text-muted"><Star className="size-4 fill-warn text-warn" aria-hidden />Avis des patients</p><p className="mt-2 font-bold text-ink">{doctor.rating.toFixed(1).replace(".", ",")} / 5 <span className="font-normal text-muted">· {doctor.reviews} avis</span></p></div>
            <div className="rounded-2xl bg-surface p-4"><p className="text-sm font-semibold text-muted">Expérience</p><p className="mt-2 font-bold text-ink">{doctor.years} ans de pratique</p></div>
            <div className="rounded-2xl bg-surface p-4"><p className="flex items-center gap-2 text-sm font-semibold text-muted"><MapPin className="size-4 text-primary" aria-hidden />Secteur et distance</p><p className="mt-2 font-bold text-ink">{doctor.area} · {doctor.distanceKm.toFixed(1).replace(".", ",")} km</p></div>
            <div className="rounded-2xl bg-surface p-4"><p className="text-sm font-semibold text-muted">Disponibilité</p><p className="mt-2 font-bold text-ink">{doctor.availabilityLabel}</p></div>
          </div>
          <div className="mt-5">
            <h2 className="font-bold text-ink">Types de consultation</h2>
            <ul className="mt-2 flex flex-wrap gap-2">{doctor.modes.map((mode) => <li key={mode} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">{mode === "Téléconsultation" && <Video className="size-4" aria-hidden />}{mode}</li>)}</ul>
          </div>
          <Link href={`/patient/medecins/${doctor.id}/rendez-vous`} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white sm:w-auto"><CalendarDays className="size-5" aria-hidden />Prendre rendez-vous</Link>
        </div>
      </article>
    </div>
  );
}
