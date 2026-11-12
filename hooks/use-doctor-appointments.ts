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

  async function updateStatus(
    id: string,
    status: DoctorAppointmentStatus,
  ): Promise<void> {
    // Mise à jour optimiste
    setAppointments((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    try {
      await appointmentService.updateStatus(id, status);
    } catch {
      // En cas d'échec, recharger pour restaurer l'état réel
      appointmentService.listDoctor().then((data) => {
        if (active.current) setAppointments(data);
      });
      throw new Error("Impossible de mettre à jour le statut du rendez-vous.");
    }
  }

  return { appointments, loading, error, updateStatus };
}
