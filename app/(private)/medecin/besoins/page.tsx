"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { DOCTOR_NEEDS, NeedPriority } from "@/lib/doctor-portal-data";
import { DOCTOR_PROFILE_DETAILS } from "@/lib/doctor-portal-data";
import { ArrowRight, List, Map, MapPin, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const PRIORITIES: NeedPriority[] = ["Élevée", "Moyenne", "Faible"];
const priorityStyle: Record<NeedPriority, string> = {
  Élevée: "bg-rose-100 text-rose-700",
  Moyenne: "bg-amber-100 text-amber-700",
  Faible: "bg-emerald-100 text-emerald-700",
};

export default function DoctorNeedsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [priority, setPriority] = useState("");
  const [mode, setMode] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const filtered = useMemo(() => DOCTOR_NEEDS.filter((need) =>
    (!query || `${need.title} ${need.summary} ${need.district}`.toLowerCase().includes(query.toLowerCase()))
    && (!specialty || need.specialty === specialty)
    && (!priority || need.priority === priority)
    && (!mode || need.mode === mode)
  ), [query, specialty, priority, mode]);

  if (DOCTOR_PROFILE_DETAILS.verificationStatus !== "Vérifié") {
    return (
      <div className={`${doctorCard} mx-auto max-w-2xl p-8 text-center`}>
        <ShieldCheck className="mx-auto size-10 text-amber-500" aria-hidden />
        <h1 className="mt-4 text-2xl font-extrabold text-night">Vérification requise</h1>
        <p className="mt-2 text-muted">L’accès aux besoins des patients est réservé aux médecins dont le compte a été vérifié.</p>
        <Link href="/medecin/profil" className="mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-5 font-semibold text-white">Voir mon profil professionnel</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Besoins des patients" description="Consultez les demandes pertinentes dans votre zone et proposez vos services." />
      <section className={`${doctorCard} grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4`} aria-label="Filtrer les besoins">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Rechercher un besoin ou un quartier</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Besoin ou quartier" className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
        </label>
        <label>
          <span className="sr-only">Spécialité</span>
          <select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink">
            <option value="">Toutes les spécialités</option>
            {[...new Set(DOCTOR_NEEDS.map((need) => need.specialty))].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Priorité</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink">
            <option value="">Toutes les priorités</option>
            {PRIORITIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Type de consultation</span>
          <select value={mode} onChange={(event) => setMode(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink">
            <option value="">Tous les types</option>
            <option>À domicile</option>
            <option>Téléconsultation</option>
          </select>
        </label>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite"><strong className="text-ink">{filtered.length}</strong> besoin{filtered.length !== 1 ? "s" : ""} dans votre zone</p>
        <div role="group" aria-label="Mode d’affichage" className="inline-flex rounded-xl bg-white p-1 shadow-sm">
          {([["list", "Liste", List], ["map", "Carte", Map]] as const).map(([id, label, Icon]) => (
            <button key={id} type="button" onClick={() => setView(id)} aria-pressed={view === id} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === id ? "bg-primary text-white" : "text-muted"}`}>
              <Icon className="size-4" aria-hidden />{label}
            </button>
          ))}
        </div>
      </div>
      {view === "map" && (
        <div className={`${doctorCard} relative h-64 overflow-hidden bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-100 sm:h-80`}>
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(35deg, transparent 48%, #94a3b8 49%, #94a3b8 50%, transparent 51%), linear-gradient(125deg, transparent 48%, #94a3b8 49%, #94a3b8 50%, transparent 51%)", backgroundSize: "54px 48px" }} />
          <div className="absolute inset-8 rounded-[40%] border-2 border-dashed border-emerald-500/60" />
          {filtered.map((need, index) => (
            <Link key={need.id} href={`/medecin/besoins/${need.id}`} title={`${need.title} · ${need.distanceKm} km`} className="absolute grid size-10 place-items-center rounded-full border-2 border-white bg-primary text-xs font-extrabold text-white shadow-lg" style={{ left: `${18 + ((index * 17) % 66)}%`, top: `${20 + ((index * 23) % 58)}%` }}>
              {need.distanceKm.toFixed(0)}
            </Link>
          ))}
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-night"><MapPin className="mr-1 inline size-3.5 text-primary" aria-hidden />Yaoundé · distances approximatives</span>
        </div>
      )}
      {filtered.length === 0 ? (
        <div className={`${doctorCard} p-10 text-center text-muted`}>Aucun besoin ne correspond à ces filtres.</div>
      ) : (
        <ul className="grid gap-3 xl:grid-cols-2">
          {filtered.map((need) => (
            <li key={need.id} className={`${doctorCard} flex min-w-0 flex-col gap-3 p-4 sm:p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-night sm:text-lg">{need.title}</h2>
                  <p className="mt-1 text-sm text-muted">{need.summary}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${priorityStyle[need.priority]}`}>Priorité {need.priority.toLowerCase()}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-primary">{need.specialty}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-muted"><MapPin className="size-3" aria-hidden />{need.city} · {need.district} · {need.distanceKm} km</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-muted">{need.mode}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-muted">{need.publishedAt}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-muted">Disponible : {need.availableFrom}</span>
                <Link href={`/medecin/besoins/${need.id}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-blue-700">
                  Consulter les détails <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Les informations personnelles et les adresses exactes des patients restent confidentielles. Les emplacements affichés sont approximatifs.
      </p>
    </div>
  );
}
