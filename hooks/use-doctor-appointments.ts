"use client";

import { useEffect, useState, useRef } from "react";
import {
  appointmentService,
  type DoctorAppointment,
  type DoctorAppointmentStatus,
} from "@/services/appointment-service";

export function useDoctorAppointments() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    appointmentService
      .listDoctor()
      .then((data) => {
        if (active.current) {
          setAppointments(data);
          setLoading(false);
        }
      })
      .catch((cause: unknown) => {
        if (active.current) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger les rendez-vous.",
          );
          setLoading(false);
        }
      });
    return () => {
      active.current = false;
    };
  }, []);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function updateStatus(id: string, status: DoctorAppointmentStatus): Promise<void> {
    setUpdatingId(id);
    setActionError(null);
    try {
      await appointmentService.updateStatus(id, status);
      const refreshed = await appointmentService.listDoctor();
      if (active.current) setAppointments(refreshed);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Impossible de modifier le rendez-vous.";
      if (active.current) setActionError(message);
      throw cause;
    } finally {
      if (active.current) setUpdatingId(null);
    }
  }

  return { appointments, loading, error, actionError, updatingId, updateStatus };
}
