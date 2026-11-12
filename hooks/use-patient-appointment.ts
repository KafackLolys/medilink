"use client";

import { useEffect, useState } from "react";
import {
  appointmentService,
  type PatientAppointment,
} from "@/services/appointment-service";

export function usePatientAppointment(id: string) {
  const [appointment, setAppointment] = useState<PatientAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    appointmentService
      .detail(id)
      .then((result) => {
        if (active) setAppointment(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger ce rendez-vous.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { appointment, loading, error };
}
