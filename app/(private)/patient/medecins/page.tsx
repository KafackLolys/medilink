"use client";

import { DoctorCard } from "../../components/doctor-card";
import { TextField } from "@/components/custum/field";
import { useDoctors } from "@/hooks/use-doctors";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const card = "rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";

export default function FindDoctorPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [filters, setFilters] = useState({ q: "", city: "", specialty: "" });
  const { doctors, specialties, loading, error, retry } = useDoctors(filters);

  function resetFilters() {
    setQuery("");
    setCity("");
    setSpecialty("");
    setFilters({ q: "", city: "", specialty: "" });
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Trouver un médecin</h1>
        <p className="mt-2 text-lg text-muted">Consultez les profils des médecins vérifiés et leurs disponibilités.</p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setFilters({ q: query.trim(), city: city.trim(), specialty });
        }}
        className={`${card} grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6`}
        aria-label="Filtres de recherche"
      >
        <TextField
          label="Rechercher"
          icon={<Search />}
          placeholder="Nom ou spécialité"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <TextField
          label="Ville ou secteur"
          placeholder="Ex. Yaoundé"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <label className="block text-sm font-semibold text-ink">
          Spécialité
          <select
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-normal text-ink"
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button type="submit" className="h-12 flex-1 rounded-xl bg-primary px-4 font-semibold text-white" disabled={loading}>
            Rechercher
          </button>
          <button type="button" onClick={resetFilters} className="h-12 rounded-xl bg-surface px-4 font-semibold text-ink">
            Effacer
          </button>
        </div>
      </form>

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"><span>{error}</span><button type="button" onClick={retry} className="rounded-lg border border-rose-300 px-3 py-2 font-semibold">Réessayer</button></div>}

      <p className="text-[15px] text-muted" aria-live="polite">
        <strong className="text-ink">{loading ? "…" : doctors.length}</strong>{" "}
        {doctors.length === 1 ? "médecin trouvé" : "médecins trouvés"}
      </p>

      {loading ? (
        <div role="status" className={`${card} p-12 text-center text-muted`}>Chargement des profils vérifiés…</div>
      ) : doctors.length === 0 ? (
        <div className={`${card} grid place-items-center gap-4 p-12 text-center`}>
          <p className="text-lg font-semibold text-ink">
            {error ? "Les médecins ne peuvent pas être chargés pour le moment." : "Aucun médecin ne correspond à ces critères."}
          </p>
          {!error && <button onClick={resetFilters} className="h-11 rounded-full bg-surface px-6 font-semibold text-ink">Effacer les filtres</button>}
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {doctors.map((doctor) => <li key={doctor.id}><DoctorCard doctor={doctor} /></li>)}
        </ul>
      )}

      <section className="flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-secondary/[.09] p-7 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <h2 className="text-xl font-extrabold tracking-tight text-night">Vous ne savez pas qui choisir ?</h2>
          <p className="mt-1 text-[15px] text-muted">Décrivez votre situation et recevez des propositions des médecins de votre secteur.</p>
        </div>
        <Link href="/patient/besoins/nouveau" className="inline-flex h-12 shrink-0 items-center rounded-full bg-secondary px-7 font-semibold text-white">Publier un besoin</Link>
      </section>
    </div>
  );
}
