"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { DOCTOR_ZONES } from "@/lib/doctor-portal-data";
import { ArrowLeft, Check, MapPin, Minus, Plus, Radius } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DoctorServiceAreaPage() {
  const [city, setCity] = useState<string>(DOCTOR_ZONES.city);
  const [districts, setDistricts] = useState<string[]>([...DOCTOR_ZONES.districts]);
  const [radius, setRadius] = useState<number>(DOCTOR_ZONES.radiusKm);
  const [maxDistance, setMaxDistance] = useState<number>(DOCTOR_ZONES.maxDistanceKm);
  const [newDistrict, setNewDistrict] = useState("");
  const [saved, setSaved] = useState(false);

  function addDistrict() {
    const name = newDistrict.trim();
    if (name && !districts.some((district) => district.toLowerCase() === name.toLowerCase())) {
      setDistricts((current) => [...current, name]);
      setNewDistrict("");
      setSaved(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link href="/medecin/profil" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden />Retour au profil</Link>
      <DoctorPageHeading title="Zone d’intervention" description="Choisissez les localités où vous acceptez de consulter vos patients." />
      {saved && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Votre zone d’intervention a été enregistrée.</p>}
      <div className="grid gap-4 lg:grid-cols-5">
        <section className={`${doctorCard} space-y-5 p-4 sm:p-5 lg:col-span-2`}>
          <label className="block text-sm font-semibold text-ink">Ville principale
            <input value={city} onChange={(event) => { setCity(event.target.value); setSaved(false); }} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-primary" />
          </label>
          <div>
            <h2 className="text-sm font-bold text-ink">Quartiers couverts</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {districts.map((district) => <li key={district} className="inline-flex items-center gap-1 rounded-full bg-blue-50 py-1 pl-3 pr-1 text-xs font-semibold text-primary">{district}<button type="button" aria-label={`Supprimer ${district}`} onClick={() => { setDistricts((items) => items.filter((item) => item !== district)); setSaved(false); }} className="grid size-6 place-items-center rounded-full hover:bg-blue-100"><Minus className="size-3" aria-hidden /></button></li>)}
            </ul>
            <div className="mt-3 flex gap-2">
              <input value={newDistrict} onChange={(event) => setNewDistrict(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addDistrict(); } }} placeholder="Ajouter un quartier" className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary" />
              <button type="button" onClick={addDistrict} aria-label="Ajouter le quartier" className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white"><Plus className="size-4" aria-hidden /></button>
            </div>
          </div>
          <label className="block text-sm font-semibold text-ink">Rayon d’intervention : {radius} km
            <input type="range" min="1" max="30" value={radius} onChange={(event) => { setRadius(Number(event.target.value)); setSaved(false); }} className="mt-2 w-full accent-primary" />
          </label>
          <label className="block text-sm font-semibold text-ink">Distance maximale acceptée
            <select value={maxDistance} onChange={(event) => { setMaxDistance(Number(event.target.value)); setSaved(false); }} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">
              {[5, 10, 15, 20, 30].map((distance) => <option key={distance} value={distance}>{distance} km</option>)}
            </select>
          </label>
          <button type="button" onClick={() => setSaved(true)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white hover:bg-blue-700"><Check className="size-4" aria-hidden />Enregistrer la zone</button>
        </section>
        <section className={`${doctorCard} relative min-h-80 overflow-hidden bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-100 lg:col-span-3`} aria-label={`Carte de ${city} et des zones couvertes`}>
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(35deg, transparent 48%, #94a3b8 49%, #94a3b8 50%, transparent 51%), linear-gradient(125deg, transparent 48%, #94a3b8 49%, #94a3b8 50%, transparent 51%)", backgroundSize: "62px 54px" }} />
          <div className="absolute left-1/2 top-1/2 grid aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-dashed border-emerald-500/60 bg-emerald-400/10">
            <div className="grid size-12 place-items-center rounded-full bg-primary text-white shadow-lg"><MapPin className="size-6" aria-hidden /></div>
          </div>
          <div className="absolute left-3 top-3 rounded-xl bg-white/90 px-3 py-2 text-sm font-bold text-night shadow-sm"><Radius className="mr-1 inline size-4 text-primary" aria-hidden />{city} · rayon {radius} km</div>
          <ul className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
            {districts.map((district) => <li key={district} className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">{district}</li>)}
          </ul>
        </section>
      </div>
      <p className="text-xs leading-5 text-muted">La carte est une représentation indicative. Les patients voient uniquement une zone approximative, jamais votre adresse personnelle.</p>
    </div>
  );
}
