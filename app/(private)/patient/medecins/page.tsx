"use client";
import { List, Map, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DOCTORS, SPECIALTIES } from "@/lib/doctors";
import { SelectField, TextField } from "@/components/custum/field";
import { DoctorsMap } from "../../components/doctors-map";
import { DoctorCard } from "../../components/doctor-card";

const DIST = { "Moins de 2 km": 2, "Moins de 5 km": 5, "Moins de 10 km": 10 } as Record<string, number>;
const card = "rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";

export default function FindDoctorPage() {
  const [specialty, setSpecialty] = useState("");
  const [place, setPlace] = useState("");
  const [distance, setDistance] = useState("");
  const [avail, setAvail] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [selected, setSelected] = useState<string | null>("d1");

  const results = useMemo(() => DOCTORS
    .filter((d) => !specialty || d.specialty === specialty)
    .filter((d) => !place || d.area.toLowerCase().includes(place.toLowerCase()) || d.name.toLowerCase().includes(place.toLowerCase()))
    .filter((d) => !distance || d.distanceKm <= DIST[distance])
    .filter((d) => !avail || (avail === "Aujourd’hui" ? d.availability === "today" : d.availability !== "later"))
    .sort((a, b) => a.distanceKm - b.distanceKm), [specialty, place, distance, avail]);

  const reset = () => { setSpecialty(""); setPlace(""); setDistance(""); setAvail(""); };
  const sel = results.find((d) => d.id === selected) ?? results[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Trouver un médecin</h1>
        <p className="mt-2 text-lg text-muted">Des médecins vérifiés près de chez vous, pour une consultation à domicile ou à distance.</p>
      </div>

      <section aria-label="Filtres de recherche" className={`${card} grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6`}>
        <SelectField label="Spécialité" options={SPECIALTIES} value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Toutes les spécialités" />
        <TextField label="Ville ou quartier" icon={<MapPin />} placeholder="Ex. Secteur Nord" value={place} onChange={(e) => setPlace(e.target.value)} />
        <SelectField label="Distance" options={Object.keys(DIST)} value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Peu importe" />
        <SelectField label="Disponibilité" options={["Aujourd’hui", "Cette semaine"]} value={avail} onChange={(e) => setAvail(e.target.value)} placeholder="Peu importe" />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-muted" aria-live="polite"><strong className="text-ink">{results.length}</strong> {results.length > 1 ? "médecins trouvés" : "médecin trouvé"}, du plus proche au plus éloigné</p>
        <div role="group" aria-label="Mode d’affichage" className="inline-flex rounded-full bg-white p-1 shadow-sm">
          {([["list", "Liste", List], ["map", "Carte", Map]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setView(id)} aria-pressed={view === id}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition ${view === id ? "bg-primary text-white" : "text-muted hover:text-ink"}`}>
              <Icon className="size-4" aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className={`${card} grid place-items-center gap-4 p-12 text-center`}>
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/[.08] text-primary"><Search className="size-7" aria-hidden /></span>
          <p className="text-lg font-semibold text-ink">Aucun médecin ne correspond à ces critères.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={reset} className="h-11 rounded-full bg-surface px-6 font-semibold text-ink">Effacer les filtres</button>
            <Link href="/patient/besoins/nouveau" className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Publier un besoin</Link>
          </div>
        </div>
      ) : view === "list" ? (
        <ul className="grid gap-4 md:grid-cols-2">{results.map((d) => <li key={d.id}><DoctorCard d={d} /></li>)}</ul>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <DoctorsMap doctors={results} selectedId={sel?.id ?? null} onSelect={setSelected} />
          <div className="space-y-4">{sel && <DoctorCard d={sel} selected compact />}<p className="px-1 text-sm text-muted">Touchez une pastille sur la carte pour voir un autre médecin.</p></div>
        </div>
      )}

      <section className="flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-secondary/[.09] p-7 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <h2 className="text-xl font-extrabold tracking-tight text-night">Vous ne savez pas qui choisir ?</h2>
          <p className="mt-1 text-[15px] text-muted">Décrivez votre situation : les médecins vérifiés de votre secteur vous envoient leurs propositions.</p>
        </div>
        <Link href="/patient/besoins/nouveau" className="inline-flex h-12 shrink-0 items-center rounded-full bg-secondary px-7 font-semibold text-white">Publier un besoin</Link>
      </section>
    </div>
  );
}
