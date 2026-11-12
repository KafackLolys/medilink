"use client";
import { GeoMap } from "./geo-map";
import type { DoctorListing } from "@/lib/doctors";

/** Markers require verified geographic coordinates; never use invented CSS positions. */
export function DoctorsMap({ doctors, selectedId, onSelect }: {
  doctors: DoctorListing[]; selectedId: string | null; onSelect: (id: string) => void;
}) {
  const mapped = doctors.flatMap(doctor => doctor.coordinates ? [{
    id: doctor.id, title: doctor.name, latitude: doctor.coordinates.latitude,
    longitude: doctor.coordinates.longitude, href: `/patient/medecins/${doctor.id}`,
  }] : []);
  return <div className="space-y-3">
    <GeoMap points={mapped} emptyMessage="Aucune position professionnelle vérifiée n'est disponible. Consultez les médecins dans la liste." />
    <div className="flex flex-wrap gap-2">{doctors.map(doctor => <button type="button" key={doctor.id}
      onClick={() => onSelect(doctor.id)} aria-pressed={doctor.id === selectedId}
      className={`rounded-lg border px-3 py-2 text-sm ${doctor.id === selectedId ? "border-primary bg-blue-50 text-primary" : "border-slate-200"}`}>{doctor.name}</button>)}</div>
  </div>;
}
