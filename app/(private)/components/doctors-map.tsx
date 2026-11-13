"use client";
import { GeoMap } from "./geo-map";
import { DoctorCard } from "./doctor-card";
import type { DoctorDirectoryItem } from "@/services/doctor-service";

type LocatedDoctor = DoctorDirectoryItem & {
  coordinates?: { latitude: number; longitude: number };
};

/** Render only coordinates returned by the API; never infer a precise marker from a city name. */
export function DoctorsMap({ doctors, selectedId, onSelect }: {
  doctors: DoctorDirectoryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const mapped = (doctors as LocatedDoctor[]).flatMap((doctor) => {
    const coordinates = doctor.coordinates;
    if (!coordinates) return [];
    const { latitude, longitude } = coordinates;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
    return [{ id: doctor.id, title: doctor.name, latitude, longitude,
      href: `/patient/medecins/${encodeURIComponent(doctor.id)}` }];
  });
  const selected = doctors.find((doctor) => doctor.id === selectedId);

  return (
    <section aria-label="Explorer les médecins sur la carte" className="space-y-4">
      <GeoMap points={mapped} emptyMessage="Les profils vérifiés ne disposent pas encore de coordonnées géographiques validées. Sélectionnez un médecin ci-dessous ou revenez à la liste ; aucun emplacement n'est inventé." />
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <h2 className="text-base font-bold text-night">Choisir un médecin</h2>
        <p className="mt-1 text-sm text-muted">Sélectionnez un profil pour afficher sa fiche sans quitter l’annuaire.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {doctors.map((doctor) => (
            <button key={doctor.id} type="button" onClick={() => onSelect(doctor.id)}
              aria-pressed={selectedId === doctor.id}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold ${selectedId === doctor.id ? "border-primary bg-primary/10 text-primary" : "border-slate-200 text-ink"}`}>
              {doctor.name}
            </button>
          ))}
        </div>
      </div>
      {selected && <DoctorCard doctor={selected} />}
    </section>
  );
}
