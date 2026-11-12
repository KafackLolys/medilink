"use client";

import { useEffect, useState } from "react";
import {
  appointmentService,
  type PatientAppointment,
} from "@/services/appointment-service";

export function usePatientAppointments() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    appointmentService
      .listMine()
      .then((result) => {
        if (active) setAppointments(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger vos rendez-vous.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { appointments, loading, error };
}
