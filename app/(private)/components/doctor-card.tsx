import { BadgeCheck, MapPin, Star } from "lucide-react";
import Link from "next/link";
import type { DoctorListing } from "@/lib/doctors";

const AVAIL = { today: "bg-success/10 text-success", week: "bg-primary/10 text-primary", later: "bg-slate-100 text-slate-600" };

export function DoctorCard({ d, selected = false, compact = false }: { d: DoctorListing; selected?: boolean; compact?: boolean }) {
  return (
    <article className={`rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] transition ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-start gap-4">
        <span className={`grid size-16 shrink-0 place-items-center rounded-2xl text-xl font-bold ${d.color}`}>{d.initials}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-ink">{d.name}</h3>
          <p className="text-[15px] text-muted">{d.specialty}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-success"><BadgeCheck className="size-4" aria-hidden /> Médecin vérifié</p>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-muted">
        <span className="inline-flex items-center gap-1 font-semibold text-ink"><Star className="size-4 fill-warn text-warn" aria-hidden />{d.rating.toFixed(1).replace(".", ",")} <span className="font-normal text-muted">({d.reviews} avis)</span></span>
        <span>{d.years} ans d’expérience</span>
      </p>
      <p className="mt-1.5 flex items-center gap-1.5 text-[15px] text-muted"><MapPin className="size-4" aria-hidden />{d.area} · à {d.distanceKm.toFixed(1).replace(".", ",")} km</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${AVAIL[d.availability]}`}>{d.availabilityLabel}</span>
        {!compact && d.modes.map((m) => <span key={m} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">{m}</span>)}
      </div>
      <div className={`mt-5 grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
        <Link href={`/patient/medecins/${d.id}`} className="inline-flex h-11 items-center justify-center rounded-full bg-surface px-3 text-[15px] font-semibold text-ink hover:bg-slate-100">Voir le profil</Link>
        <Link href={`/patient/medecins/${d.id}/rendez-vous`} className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-3 text-[15px] font-semibold text-white">Prendre rendez-vous</Link>
      </div>
    </article>
  );
}
