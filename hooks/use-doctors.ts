"use client";

import { useEffect, useState } from "react";
import {
  doctorService,
  type DoctorDirectoryItem,
  type DoctorFilters,
} from "@/services/doctor-service";

export function useDoctors(filters: DoctorFilters) {
  const [response, setResponse] = useState<{
    key: string;
    doctors: DoctorDirectoryItem[];
    specialties: string[];
  } | null>(null);
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);
  const query = filters.q ?? "";
  const city = filters.city ?? "";
  const specialty = filters.specialty ?? "";
  const key = JSON.stringify([query, city, specialty]);

  useEffect(() => {
    let active = true;
    doctorService
      .list({ q: query, city, specialty })
      .then((result) => {
        if (!active) return;
        setResponse({ key, doctors: result.doctors, specialties: result.specialties });
      })
      .catch((cause: unknown) => {
        if (active) {
          setFailure({
            key,
            message:
              cause instanceof Error
                ? cause.message
                : "Impossible de charger la liste des médecins.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [city, key, query, specialty]);

  const currentResponse = response?.key === key ? response : null;
  const currentFailure = failure?.key === key ? failure : null;
  return {
    doctors: currentResponse?.doctors ?? [],
    specialties: currentResponse?.specialties ?? [],
    loading: !currentResponse && !currentFailure,
    error: currentFailure?.message ?? null,
  };
}
