"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import type { DoctorDirectoryItem } from "@/services/doctor-service";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; doctors: DoctorDirectoryItem[] };

function initials(name: string): string {
  return name.replace(/^Dr\.?\s*/i, "").split(/\s+/).slice(0, 2)
    .map((part) => part.charAt(0)).join("").toUpperCase();
}

function location(doctor: DoctorDirectoryItem): string | null {
  return doctor.serviceCity || doctor.professionalAddress || null;
}

export default function RecommendedDoctors() {
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/public/doctors/recommended`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as { doctors: DoctorDirectoryItem[] };
      })
      .then((result) => {
        if (!controller.signal.aborted) {
          setState({ status: "ready", doctors: result.doctors });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  return (
    <section id="medecins" className="mt-16" aria-labelledby="recommended-doctors-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="recommended-doctors-title" className="text-2xl font-extrabold tracking-tight text-night">
            Découvrez nos médecins vérifiés
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Profils réels et informations issues de MediLink. Les notes affichées proviennent des avis publiés.
          </p>
        </div>
        <Link href="/patient/medecins" className="text-sm font-bold text-primary hover:underline">
          Voir tous les médecins
        </Link>
      </div>
      {state.status === "loading" && (
        <p role="status" className="mt-6 rounded-3xl bg-white p-8 text-center text-muted">
          Chargement des profils vérifiés…
        </p>
      )}
      {state.status === "error" && (
        <p role="status" className="mt-6 rounded-3xl bg-white p-8 text-center text-muted">
          Les profils sont momentanément indisponibles. Vous pouvez consulter notre annuaire après connexion.
        </p>
      )}
      {state.status === "ready" && state.doctors.length === 0 && (
        <p className="mt-6 rounded-3xl bg-white p-8 text-center text-muted">
          Aucun médecin vérifié n’est disponible dans l’annuaire pour le moment.
        </p>
      )}
      {state.status === "ready" && state.doctors.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {state.doctors.map((doctor) => (
            <article key={doctor.id} className="flex flex-col rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.15)]">
              <div className="flex items-center gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                  {initials(doctor.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-ink">{doctor.name}</h3>
                  <p className="text-sm text-muted">{doctor.specialty}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-ink">
                    <Star className="size-4 fill-warn text-warn" aria-hidden />
                    {doctor.rating === null ? "Pas encore d’avis" : `${doctor.rating.toFixed(1).replace(".", ",")} / 5`}
                    {doctor.reviewsCount > 0 && (
                      <span className="font-normal text-muted">· {doctor.reviewsCount} avis</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                {location(doctor) && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <MapPin className="size-4" aria-hidden /> {location(doctor)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                  <BadgeCheck className="size-4" aria-hidden /> Vérifié
                </span>
              </div>
              {doctor.yearsOfExperience > 0 && (
                <p className="mt-3 text-xs text-muted">{doctor.yearsOfExperience} ans d’expérience</p>
              )}
              <Link href={`/patient/medecins/${encodeURIComponent(doctor.id)}`}
                className="mt-auto flex h-11 w-full items-center justify-center rounded-full bg-primary/[.08] pt-1 font-semibold text-primary hover:bg-primary/15">
                Voir le profil
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
