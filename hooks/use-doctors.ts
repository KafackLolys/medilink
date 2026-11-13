"use client";

import { useEffect, useState } from "react";
import {
  doctorService,
  type DoctorDirectoryItem,
  type DoctorFilters,
} from "@/services/doctor-service";

type DoctorsState = {
  key: string;
  status: "loading" | "success" | "error";
  doctors: DoctorDirectoryItem[];
  error: string | null;
};

/** A request result is shown only if it belongs to the current filter key. */
export function useDoctors(filters: DoctorFilters) {
  const [state, setState] = useState<DoctorsState | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [retryNumber, setRetryNumber] = useState(0);
  const q = filters.q ?? "";
  const city = filters.city ?? "";
  const specialty = filters.specialty ?? "";
  const key = JSON.stringify([q, city, specialty, retryNumber]);

  useEffect(() => {
    let active = true;
    setState({ key, status: "loading", doctors: [], error: null });

    doctorService.list({ q, city, specialty })
      .then((result) => {
        if (!active) return;
        setSpecialties(result.specialties);
        setState({ key, status: "success", doctors: result.doctors, error: null });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setState({
          key,
          status: "error",
          doctors: [],
          error: cause instanceof Error ? cause.message : "Impossible de charger la liste des médecins.",
        });
      });

    return () => { active = false; };
  }, [key, q, city, specialty]);

  const current = state?.key === key ? state : null;
  return {
    doctors: current?.doctors ?? [],
    specialties,
    loading: !current || current.status === "loading",
    error: current?.error ?? null,
    retry: () => setRetryNumber((value) => value + 1),
  };
}
