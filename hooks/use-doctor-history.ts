"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  appointmentService,
  type DoctorAppointment,
  type DoctorAppointmentStatus,
} from "@/services/appointment-service";

export function useDoctorHistory() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [period, setPeriod] = useState<"all" | "month" | "year">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    appointmentService
      .listDoctor()
      .then((data) => {
        if (active.current) {
          const completed = data.filter(
            (item) => item.status === "completed",
          );
          setAppointments(completed);
          setLoading(false);
        }
      })
      .catch((cause: unknown) => {
        if (active.current) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger l'historique des consultations.",
          );
          setLoading(false);
        }
      });
    return () => {
      active.current = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (period === "all") return appointments;
    const now = new Date();
    return appointments.filter((item) => {
      const appointmentDate = new Date(`${item.date}T00:00:00`);
      if (period === "month") {
        return (
          appointmentDate.getMonth() === now.getMonth() &&
          appointmentDate.getFullYear() === now.getFullYear()
        );
      }
      if (period === "year") {
        return appointmentDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [appointments, period]);

  return {
    appointments: filtered,
    loading,
    error,
    period,
    setPeriod,
  };
}
