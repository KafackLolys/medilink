"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { useDoctorNeeds } from "@/hooks/use-doctor-needs";
import type { DoctorNeedFilters } from "@/services/need-service";
import { ArrowRight, List, Map, MapPin, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const priorityLabels: Record<NonNullable<DoctorNeedFilters["priority"]>, string> = {
  emergency: "Élevée",
  urgent: "Moyenne",
  routine: "Faible",
};
const priorityStyle: Record<NonNullable<DoctorNeedFilters["priority"]>, string> = {
  emergency: "bg-rose-100 text-rose-700",
  urgent: "bg-amber-100 text-amber-700",
  routine: "bg-emerald-100 text-emerald-700",
};

function formatPublishedAt(value: string): string {
  return `Publié le ${new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))}`;
}

export default function DoctorNeedsPage() {
  const { items, specialties, page, total, totalPages, loading, error, load } =
    useDoctorNeeds();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [priority, setPriority] = useState<DoctorNeedFilters["priority"] | "">("");
  const [mode, setMode] = useState<DoctorNeedFilters["mode"] | "">("");
  const [activeFilters, setActiveFilters] = useState<DoctorNeedFilters>({});
  const [view, setView] = useState<"list" | "map">("list");

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFilters: DoctorNeedFilters = {
      q: query.trim() || undefined,
      specialty: specialty || undefined,
      priority: priority || undefined,
      mode: mode || undefined,
    };
    setActiveFilters(nextFilters);
    load(nextFilters, 1);
  }

  function clearFilters() {
    setQuery("");
    setSpecialty("");
    setPriority("");
    setMode("");
    setActiveFilters({});
    load({}, 1);
  }

  if (error?.includes("verified doctors")) {
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
      <DoctorPageHeading title="Besoins des patients" description="Consultez les demandes publiées et filtrez-les selon votre spécialité et leur priorité." />
      <form onSubmit={applyFilters} className={`${doctorCard} grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4`} aria-label="Filtrer les besoins">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Rechercher un besoin ou un quartier</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Besoin, ville ou quartier" className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
        </label>
        <label>
          <span className="sr-only">Spécialité</span>
          <select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink">
            <option value="">Toutes les spécialités</option>
            {specialties.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Priorité</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value as DoctorNeedFilters["priority"] | "")} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink">
            <option value="">Toutes les priorités</option>
            <option value="emergency">Élevée — urgence</option>
            <option value="urgent">Moyenne — rapide</option>
            <option value="routine">Faible — normale</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Type de consultation</span>
          <select value={mode} onChange={(event) => setMode(event.target.value as DoctorNeedFilters["mode"] | "")} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink">
            <option value="">Tous les types</option>
            <option value="home">À domicile</option>
            <option value="teleconsultation">Téléconsultation</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
          <button type="submit" className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white disabled:opacity-60" disabled={loading}>Appliquer les filtres</button>
          <button type="button" onClick={clearFilters} className="h-10 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-ink">Réinitialiser</button>
        </div>
      </form>

      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          <strong className="text-ink">{loading ? "…" : total}</strong> demande{total !== 1 ? "s" : ""} disponible{total !== 1 ? "s" : ""}
        </p>
        <div role="group" aria-label="Mode d’affichage" className="inline-flex rounded-xl bg-white p-1 shadow-sm">
          {([["list", "Liste", List], ["map", "Carte", Map]] as const).map(([id, label, Icon]) => (
            <button key={id} type="button" onClick={() => setView(id)} aria-pressed={view === id} className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === id ? "bg-primary text-white" : "text-muted"}`}>
              <Icon className="size-4" aria-hidden />{label}
            </button>
          ))}
        </div>
      </div>

      {view === "map" && (
        <div className={`${doctorCard} flex min-h-40 flex-col items-center justify-center gap-2 p-8 text-center text-muted`}>
          <MapPin className="size-7 text-primary" aria-hidden />
          <p className="font-semibold text-ink">La carte nécessite des coordonnées géographiques.</p>
          <p className="text-sm">Les demandes ne contiennent actuellement que la ville et le quartier. Consultez-les dans la liste sans distance estimée.</p>
        </div>
      )}

      {loading ? (
        <div role="status" className={`${doctorCard} p-10 text-center text-muted`}>Chargement des demandes…</div>
      ) : items.length === 0 ? (
        <div className={`${doctorCard} p-10 text-center text-muted`}>{Object.values(activeFilters).some(Boolean) ? "Aucune demande ne correspond à ces filtres." : "Aucune demande disponible pour le moment."}</div>
      ) : (
        <ul className="grid gap-3 xl:grid-cols-2">
          {items.map((need) => (
            <li key={need.id} className={`${doctorCard} flex min-w-0 flex-col gap-3 p-4 sm:p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-night sm:text-lg">{need.title}</h2>
                  <p className="mt-1 line-clamp-3 text-sm text-muted">{need.summary}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${priorityStyle[need.priority]}`}>Priorité {priorityLabels[need.priority].toLowerCase()}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-primary">{need.specialty}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-muted"><MapPin className="size-3" aria-hidden />{need.city} · {need.district}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-muted">{need.mode === "home" ? "À domicile" : "Téléconsultation"}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-muted">{formatPublishedAt(need.publishedAt)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-muted">Documents joints : {need.documentsCount}</span>
                <Link href={`/medecin/besoins/${need.id}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-blue-700">
                  Consulter les détails <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <nav className="flex items-center justify-between gap-3" aria-label="Pagination des demandes">
        <button type="button" disabled={loading || page <= 1} onClick={() => load(activeFilters, page - 1)} className="h-10 rounded-xl bg-white px-4 text-sm font-semibold text-ink shadow-sm disabled:opacity-50">Précédent</button>
        <span className="text-sm text-muted" aria-live="polite">Page {page}{totalPages > 0 ? ` sur ${totalPages}` : ""}</span>
        <button type="button" disabled={loading || page >= totalPages} onClick={() => load(activeFilters, page + 1)} className="h-10 rounded-xl bg-white px-4 text-sm font-semibold text-ink shadow-sm disabled:opacity-50">Suivant</button>
      </nav>
      <p className="flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Les informations personnelles et les adresses exactes des patients restent confidentielles. Les emplacements affichés sont limités à la ville et au quartier.
      </p>
    </div>
  );
}
