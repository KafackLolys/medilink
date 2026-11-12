"use client";

import { useEffect, useState } from "react";
import {
  doctorService,
  type DoctorDirectoryItem,
} from "@/services/doctor-service";

export function useDoctor(id: string) {
  const [result, setResult] = useState<{ id: string; doctor: DoctorDirectoryItem } | null>(null);
  const [failure, setFailure] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    doctorService
      .detail(id)
      .then((doctor) => {
        if (active) setResult({ id, doctor });
      })
      .catch((cause: unknown) => {
        if (active) {
          setFailure({
            id,
            message:
              cause instanceof Error
                ? cause.message
                : "Impossible de charger ce profil médecin.",
          });
        }
      })
    return () => {
      active = false;
    };
  }, [id]);

  const doctor = result?.id === id ? result.doctor : null;
  const error = failure?.id === id ? failure.message : null;
  return { doctor, loading: !doctor && !error, error };
}
